#!/usr/bin/env node
/**
 * Maersk Ocean Booking API Test Script
 * 
 * This script tests the Maersk DCSA v2 Booking API
 * 
 * Usage:
 *   node scripts/test-maersk-booking.mjs
 * 
 * Configuration:
 *   Set the following environment variables in .env:
 *   - MAERSK_CONSUMER_KEY
 *   - MAERSK_CLIENT_ID  
 *   - MAERSK_CLIENT_SECRET
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env file manually (no external dependencies)
function loadEnv() {
    try {
        const envPath = resolve(process.cwd(), '.env');
        const envContent = readFileSync(envPath, 'utf-8');
        for (const line of envContent.split('\n')) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                const value = valueParts.join('=').replace(/^["']|["']$/g, '');
                if (key && !process.env[key]) {
                    process.env[key] = value;
                }
            }
        }
    } catch (e) {
        console.log("Note: Could not load .env file:", e.message);
    }
}

loadEnv();

// Debug logging to file
import { appendFileSync } from 'fs';
const LOG_FILE = '/Users/ccorsi/Documents/Proofgeist/gmt-web/.cursor/debug.log';
function logResult(data) {
    const entry = JSON.stringify({ ...data, timestamp: new Date().toISOString() }) + '\n';
    appendFileSync(LOG_FILE, entry);
    console.log('📝 Logged:', data.message || data.status);
}

// ============================================================================
// CONFIGURATION - Set these in .env file
// ============================================================================
const config = {
    // OAuth 2.0 Credentials
    consumerKey: process.env.MAERSK_CONSUMER_KEY || "YOUR_CONSUMER_KEY",
    clientId: process.env.MAERSK_CLIENT_ID || "YOUR_CLIENT_ID",
    clientSecret: process.env.MAERSK_CLIENT_SECRET || "YOUR_CLIENT_SECRET",

    // API URLs
    authUrl: "https://api-stage.maersk.com/customer-identity/oauth/v2/access_token",
    bookingUrl: "https://api-stage.maersk.com/booking/ocean/dcsa/v2/bookings",

    // Set to true to use production endpoints
    useProduction: false,
};

// Update URLs for production if needed
if (config.useProduction) {
    config.authUrl = "https://api.maersk.com/customer-identity/oauth/v2/access_token";
    config.bookingUrl = "https://api.maersk.com/booking/ocean/dcsa/v2/bookings";
}

// ============================================================================
// MULTIPLE BOOKING CONFIGURATIONS
// ============================================================================
const bookingConfigs = [
    {
        name: "Booking 1: Philadelphia → Puerto Cortes (Dec 29)",
        offerId: "P_7758847889_P021145an",
        origin: "USPHL",
        destination: "HNPCR",
        bookingOffice: "USPHL",
        arrivalStart: "2026-01-07",
        arrivalEnd: "2026-01-14",
        weight: 19000,
        commodity: "Garments, apparel, used"
    },
    {
        name: "Booking 2: Port Everglades → San Pedro Sula (Dec 14)",
        offerId: "P_7806568643_P02114y61",
        origin: "USPEF",  // Port Everglades, FL
        destination: "HNSAP",  // San Pedro Sula
        bookingOffice: "USMIA",  // Miami office
        arrivalStart: "2025-12-18",
        arrivalEnd: "2025-12-25",
        weight: 16500,
        commodity: "Garments, apparel, used"
    }
];

// Helper to create payload from config
function createPayload(cfg) {
    return {
        cargoMovementTypeAtDestination: "FCL",
        cargoMovementTypeAtOrigin: "FCL",
        deliveryTypeAtDestination: "CY",
        receiptTypeAtOrigin: "CY",
        isEquipmentSubstitutionAllowed: false,
        serviceContractReference: cfg.offerId,
        documentParties: {
            bookingAgent: {
                partyName: "Test Company",
                address: { street: "Test Street", city: "Philadelphia", countryCode: "US" },
                partyContactDetails: [{ name: "Test Contact", email: "test@test.com" }],
                identifyingCodes: [{ codeListProvider: "ZZZ", partyCode: "10000007951", codeListName: "DID" }]
            },
            serviceContractOwner: {
                partyName: "Test Company",
                address: { street: "Test Street", city: "Philadelphia", countryCode: "US" },
                partyContactDetails: [{ name: "Test Contact", email: "test@test.com" }],
                identifyingCodes: [{ codeListProvider: "ZZZ", partyCode: "10000007951", codeListName: "DID" }]
            },
            carrierBookingOffice: {
                UNLocationCode: cfg.bookingOffice,
                partyName: "Booking Office",
                partyContactDetails: [{ name: "Office Contact", phone: "+1 555 1234567" }]
            }
        },
        requestedEquipments: [{
            ISOEquipmentCode: "45GP",
            units: 1,
            isShipperOwned: false,
            cargoGrossWeight: { unit: "KGM", value: cfg.weight },
            commodities: [{ commodityType: cfg.commodity }]
        }],
        shipmentLocations: [
            { location: { UNLocationCode: cfg.origin }, locationTypeCode: "PRE" },
            { location: { UNLocationCode: cfg.destination }, locationTypeCode: "PDE" }
        ],
        expectedArrivalAtPlaceOfDeliveryStartDate: cfg.arrivalStart,
        expectedArrivalAtPlaceOfDeliveryEndDate: cfg.arrivalEnd,
        partyContactDetails: [{ name: "Main Contact", email: "test@test.com" }],
        carrierProprietaryAttributes: {
            cargoTypes: ["DRY"],
            bookingOfficeUNLocationCode: cfg.bookingOffice
        }
    };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get OAuth 2.0 access token
 */
async function getAccessToken() {
    console.log("\n🔐 Requesting OAuth access token...");

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", config.clientId);
    params.append("client_secret", config.clientSecret);

    const response = await fetch(config.authUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Consumer-Key": config.consumerKey,
        },
        body: params.toString(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OAuth failed: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Access token obtained successfully");
    console.log(`   Token expires in: ${data.expires_in} seconds`);

    return data.access_token;
}

/**
 * Create a booking
 */
async function createBooking(accessToken, payload) {
    console.log("\n📦 Creating booking request...");
    console.log(`   Endpoint: ${config.bookingUrl}`);

    const response = await fetch(config.bookingUrl, {
        method: "POST",
        headers: {
            "API-Version": "2",
            "Carrier-Extensions-Version": "2",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Consumer-Key": config.consumerKey,
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let responseData;

    try {
        responseData = JSON.parse(responseText);
    } catch {
        responseData = responseText;
    }

    return {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
    };
}

/**
 * Format and display errors nicely
 */
function displayErrors(errors) {
    console.log("\n❌ Validation Errors:\n");

    errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.errorCodeText || "Error"}`);
        if (error.property) {
            console.log(`     Property: ${error.property}`);
        }
        if (error.jsonPath) {
            console.log(`     Path: ${error.jsonPath}`);
        }
        console.log(`     Message: ${error.errorCodeMessage}`);
        if (error.value && typeof error.value !== "object") {
            console.log(`     Value: ${error.value}`);
        }
        console.log("");
    });
}

/**
 * Display success response
 */
function displaySuccess(data) {
    console.log("\n✅ Booking Request Accepted!\n");

    if (data.carrierBookingRequestReference) {
        console.log(`   Booking Request Reference: ${data.carrierBookingRequestReference}`);
    }
    if (data.carrierProprietaryAttributes?.preliminaryCarrierBookingReference) {
        console.log(`   Preliminary Booking Reference: ${data.carrierProprietaryAttributes.preliminaryCarrierBookingReference}`);
    }
}

// ============================================================================
// MAIN EXECUTION - Run multiple bookings
// ============================================================================

async function main() {
    console.log("═".repeat(60));
    console.log("  Maersk Ocean Booking API - Multiple Booking Test");
    console.log("═".repeat(60));
    console.log(`Environment: ${config.useProduction ? "PRODUCTION" : "STAGE"}`);
    console.log(`Running ${bookingConfigs.length} bookings...\n`);

    // Check for credentials
    if (config.consumerKey === "YOUR_CONSUMER_KEY") {
        console.log("\n⚠️  Please configure your credentials");
        process.exit(1);
    }

    const results = [];

    try {
        // Step 1: Get access token (once for all requests)
        const accessToken = await getAccessToken();

        // Step 2: Run each booking
        for (let i = 0; i < bookingConfigs.length; i++) {
            const cfg = bookingConfigs[i];
            console.log("\n" + "─".repeat(60));
            console.log(`📦 ${cfg.name}`);
            console.log(`   Offer ID: ${cfg.offerId}`);
            console.log(`   Route: ${cfg.origin} → ${cfg.destination}`);
            console.log("─".repeat(60));

            const payload = createPayload(cfg);
            const result = await createBooking(accessToken, payload);

            const logEntry = {
                bookingName: cfg.name,
                offerId: cfg.offerId,
                route: `${cfg.origin} → ${cfg.destination}`,
                status: result.status,
                statusText: result.statusText,
                success: result.status === 202,
                carrierBookingRequestReference: result.data?.carrierBookingRequestReference || null,
                preliminaryBookingReference: result.data?.carrierProprietaryAttributes?.preliminaryCarrierBookingReference || null,
                errors: result.data?.errors || null,
                correlationReference: result.data?.providerCorrelationReference || null
            };

            results.push(logEntry);
            logResult(logEntry);

            if (result.status === 202) {
                displaySuccess(result.data);
            } else if (result.status === 400 && result.data?.errors) {
                displayErrors(result.data.errors);
                if (result.data.providerCorrelationReference) {
                    console.log(`📋 Correlation: ${result.data.providerCorrelationReference}`);
                }
            } else {
                console.log("\n❌ Request failed:");
                console.log(JSON.stringify(result.data, null, 2));
            }

            // Small delay between requests
            if (i < bookingConfigs.length - 1) {
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        // Summary
        console.log("\n" + "═".repeat(60));
        console.log("  SUMMARY");
        console.log("═".repeat(60));
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        console.log(`✅ Successful: ${successful.length}`);
        console.log(`❌ Failed: ${failed.length}`);

        if (successful.length > 0) {
            console.log("\n📋 Successful Booking References:");
            successful.forEach(r => {
                console.log(`   - ${r.offerId}: ${r.preliminaryBookingReference || r.carrierBookingRequestReference}`);
            });
        }

        // Log summary
        logResult({
            message: "BATCH SUMMARY",
            totalBookings: results.length,
            successful: successful.length,
            failed: failed.length,
            bookingReferences: successful.map(r => ({
                offerId: r.offerId,
                bookingRef: r.preliminaryBookingReference || r.carrierBookingRequestReference
            }))
        });

    } catch (error) {
        console.error("\n❌ Error:", error.message);
        logResult({ message: "ERROR", error: error.message });
        process.exit(1);
    }
}

// Run the script
main();

