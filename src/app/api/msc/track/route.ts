import { NextRequest, NextResponse } from "next/server";
import { ConfidentialClientApplication } from "@azure/msal-node";
import { env } from "@/config/env";

// Cache the MSAL client and token
let msalClient: ConfidentialClientApplication | null = null;
let cachedToken: { accessToken: string; expiresOn: Date } | null = null;

function getMsalClient(): ConfidentialClientApplication {
    if (msalClient) return msalClient;

    const privateKey = env.MSC_CERT_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("MSC_CERT_PRIVATE_KEY is not configured");
    }

    // Decode base64 private key if it's encoded
    const decodedPrivateKey = privateKey.includes("-----BEGIN")
        ? privateKey
        : Buffer.from(privateKey, "base64").toString("utf-8");

    msalClient = new ConfidentialClientApplication({
        auth: {
            clientId: env.MSC_CLIENT_ID!,
            authority: `https://login.microsoftonline.com/${env.MSC_TENANT_ID}`,
            clientCertificate: {
                thumbprint: env.MSC_CERT_THUMBPRINT!,
                privateKey: decodedPrivateKey,
            },
        },
    });

    return msalClient;
}

async function getAccessToken(): Promise<string> {
    // Return cached token if still valid (with 5 min buffer)
    if (cachedToken && cachedToken.expiresOn > new Date(Date.now() + 5 * 60 * 1000)) {
        return cachedToken.accessToken;
    }

    const client = getMsalClient();
    const result = await client.acquireTokenByClientCredential({
        scopes: [env.MSC_SCOPE!],
    });

    if (!result?.accessToken) {
        throw new Error("Failed to acquire MSC access token");
    }

    cachedToken = {
        accessToken: result.accessToken,
        expiresOn: result.expiresOn ?? new Date(Date.now() + 3600 * 1000),
    };

    return cachedToken.accessToken;
}

// MSC API base URL (production)
const MSC_API_BASE = "https://api.tech.msc.com/msc/trackandtrace/v2.2";

export async function GET(request: NextRequest) {
    try {
        // Check if MSC is configured
        if (!env.MSC_CLIENT_ID || !env.MSC_TENANT_ID || !env.MSC_SCOPE || !env.MSC_CERT_THUMBPRINT || !env.MSC_CERT_PRIVATE_KEY) {
            return NextResponse.json(
                { error: "MSC API is not configured" },
                { status: 503 }
            );
        }

        const searchParams = request.nextUrl.searchParams;

        // Support different search types
        const equipmentReference = searchParams.get("container");
        const transportDocumentReference = searchParams.get("bol");
        const carrierBookingReference = searchParams.get("booking");

        // Build MSC query params
        const mscParams = new URLSearchParams();
        if (equipmentReference) {
            mscParams.set("equipmentReference", equipmentReference);
        } else if (transportDocumentReference) {
            mscParams.set("transportDocumentReference", transportDocumentReference);
        } else if (carrierBookingReference) {
            mscParams.set("carrierBookingReference", carrierBookingReference);
        } else {
            return NextResponse.json(
                { error: "Missing required parameter: container, bol, or booking" },
                { status: 400 }
            );
        }

        // Get access token
        const accessToken = await getAccessToken();

        // Call MSC API
        const mscResponse = await fetch(`${MSC_API_BASE}/events?${mscParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!mscResponse.ok) {
            const errorText = await mscResponse.text();
            console.error("MSC API error:", mscResponse.status, errorText);
            return NextResponse.json(
                { error: "MSC API error", status: mscResponse.status, details: errorText },
                { status: mscResponse.status }
            );
        }

        const data = await mscResponse.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("MSC Track & Trace error:", error);
        return NextResponse.json(
            { error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}

