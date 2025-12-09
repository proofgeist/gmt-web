#!/usr/bin/env node
/**
 * Maersk Ocean Booking API - Multi-Booking Test Script
 * Tests multiple bookings with different offers and logs all results
 */

import { readFileSync, appendFileSync } from 'fs';
import { resolve } from 'path';

// Load .env file
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

// Debug logging
const DEBUG_ENDPOINT = 'http://127.0.0.1:7242/ingest/439677c7-4897-4f06-a883-43ac62cb1190';
function debugLog(location, message, data) {
    const logEntry = { location, message, data, timestamp: Date.now(), sessionId: 'maersk-multi-booking' };
    fetch(DEBUG_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
    }).catch(() => { });
    console.log(`[LOG] ${message}:`, JSON.stringify(data, null, 2));
}

// Config
const config = {
    consumerKey: process.env.MAERSK_CONSUMER_KEY,
    clientId: process.env.MAERSK_CLIENT_ID,
    clientSecret: process.env.MAERSK_CLIENT_SECRET,
    authUrl: "https://api-stage.maersk.com/customer-identity/oauth/v2/access_token",
    bookingUrl: "https://api-stage.maersk.com/booking/ocean/dcsa/v2/bookings",
};

// Customer code from OAuth scopes
const CUSTOMER_CODE = "10000007951";

// ============================================================================
// TEST BOOKINGS - Different offers with matching routes
// ============================================================================
const testBookings = [
    {
        name: "Booking 1: Philadelphia → Puerto Cortes (Dec 29)",
        offerId: "P_7758847889_P021145an",
        origin: "USPHL",
        destination: "HNPCR",
        arrivalStart: "2026-01-07",
        arrivalEnd: "2026-01-15",
        commodity: "Garments, apparel, used",
        weight: 19000
    },
    {
        name: "Booking 2: Port Everglades → San Pedro Sula (Dec 14)",
        offerId: "P_7806568643_P02114y61",
        origin: "USEVG",  // Port Everglades (correct code)
        destination: "HNSAP",  // San Pedro Sula
        bookingOffice: "USMIA",  // Miami as booking office
        arrivalStart: "2025-12-18",
        arrivalEnd: "2025-12-25",
        commodity: "Garments, apparel, used",
        weight: 16500
    },
    {
        name: "Booking 3: Philadelphia → Puerto Cortes (Original - Dec 15)",
        offerId: "P_7800689777_P02113m8l",
        origin: "USPHL",
        destination: "HNPCR",
        arrivalStart: "2025-12-24",
        arrivalEnd: "2025-12-31",
        commodity: "Garments, apparel, used",
        weight: 19000
    }
];

// Build payload for a booking
function buildPayload(booking) {
    return {
        cargoMovementTypeAtDestination: "FCL",
        cargoMovementTypeAtOrigin: "FCL",
        deliveryTypeAtDestination: "CY",
        receiptTypeAtOrigin: "CY",
        isEquipmentSubstitutionAllowed: false,

        serviceContractReference: booking.offerId,

        documentParties: {
            bookingAgent: {
                partyName: "Test Company",
                address: { street: "Test Street", city: "Test City", countryCode: "US" },
                partyContactDetails: [{ name: "Test Contact", email: "test@test.com" }],
                identifyingCodes: [{ codeListProvider: "ZZZ", partyCode: CUSTOMER_CODE, codeListName: "DID" }]
            },
            serviceContractOwner: {
                partyName: "Test Company",
                address: { street: "Test Street", city: "Test City", countryCode: "US" },
                partyContactDetails: [{ name: "Test Contact", email: "test@test.com" }],
                identifyingCodes: [{ codeListProvider: "ZZZ", partyCode: CUSTOMER_CODE, codeListName: "DID" }]
            },
            carrierBookingOffice: {
                UNLocationCode: booking.bookingOffice || booking.origin,
                partyName: "Booking Office",
                partyContactDetails: [{ name: "Office Contact", phone: "+1 555 1234567" }]
            }
        },

        requestedEquipments: [{
            ISOEquipmentCode: "45GP",
            units: 1,
            isShipperOwned: false,
            cargoGrossWeight: { unit: "KGM", value: booking.weight },
            commodities: [{ commodityType: booking.commodity }]
        }],

        shipmentLocations: [
            { location: { UNLocationCode: booking.origin }, locationTypeCode: "PRE" },
            { location: { UNLocationCode: booking.destination }, locationTypeCode: "PDE" }
        ],

        expectedArrivalAtPlaceOfDeliveryStartDate: booking.arrivalStart,
        expectedArrivalAtPlaceOfDeliveryEndDate: booking.arrivalEnd,

        partyContactDetails: [{ name: "Main Contact", email: "test@test.com" }],

        carrierProprietaryAttributes: {
            cargoTypes: ["DRY"],
            bookingOfficeUNLocationCode: booking.bookingOffice || booking.origin
        }
    };
}

// Get OAuth token
async function getAccessToken() {
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
        throw new Error(`OAuth failed: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
}

// Create booking
async function createBooking(accessToken, payload) {
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
        data: responseData,
    };
}

// Main execution
async function main() {
    console.log("═".repeat(70));
    console.log("  Maersk Ocean Booking API - Multi-Booking Test");
    console.log("═".repeat(70));

    debugLog('test:start', 'Starting multi-booking test', {
        bookingCount: testBookings.length,
        offers: testBookings.map(b => b.offerId)
    });

    try {
        // Get token once
        console.log("\n🔐 Getting OAuth token...");
        const accessToken = await getAccessToken();
        console.log("✅ Token obtained\n");

        const results = [];

        // Process each booking
        for (let i = 0; i < testBookings.length; i++) {
            const booking = testBookings[i];
            console.log("─".repeat(70));
            console.log(`\n📦 ${booking.name}`);
            console.log(`   Offer ID: ${booking.offerId}`);
            console.log(`   Route: ${booking.origin} → ${booking.destination}`);

            const payload = buildPayload(booking);
            const result = await createBooking(accessToken, payload);

            const bookingResult = {
                name: booking.name,
                offerId: booking.offerId,
                route: `${booking.origin} → ${booking.destination}`,
                status: result.status,
                statusText: result.statusText,
                success: result.status === 202,
                carrierBookingRequestReference: result.data?.carrierBookingRequestReference || null,
                preliminaryBookingReference: result.data?.carrierProprietaryAttributes?.preliminaryCarrierBookingReference || null,
                error: result.status !== 202 ? result.data?.errors?.[0]?.errorCodeMessage || result.data?.statusCodeMessage : null
            };

            results.push(bookingResult);

            // Log each result
            debugLog(`booking:${i + 1}`, `Booking ${i + 1} result`, bookingResult);

            if (result.status === 202) {
                console.log(`   ✅ SUCCESS!`);
                console.log(`   📋 Request Ref: ${bookingResult.carrierBookingRequestReference}`);
                console.log(`   📋 Preliminary Ref: ${bookingResult.preliminaryBookingReference}`);
            } else {
                console.log(`   ❌ FAILED: ${result.status} ${result.statusText}`);
                console.log(`   Error: ${bookingResult.error}`);
            }

            // Small delay between requests
            if (i < testBookings.length - 1) {
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        // Summary
        console.log("\n" + "═".repeat(70));
        console.log("  SUMMARY");
        console.log("═".repeat(70));

        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        console.log(`\n✅ Successful: ${successful.length}/${results.length}`);
        console.log(`❌ Failed: ${failed.length}/${results.length}`);

        if (successful.length > 0) {
            console.log("\n📋 Successful Booking References:");
            successful.forEach(r => {
                console.log(`   • ${r.offerId}`);
                console.log(`     Request Ref: ${r.carrierBookingRequestReference}`);
                console.log(`     Preliminary: ${r.preliminaryBookingReference}`);
            });
        }

        if (failed.length > 0) {
            console.log("\n❌ Failed Bookings:");
            failed.forEach(r => {
                console.log(`   • ${r.offerId}: ${r.error}`);
            });
        }

        // Final log with all results
        debugLog('test:complete', 'Multi-booking test complete', {
            total: results.length,
            successful: successful.length,
            failed: failed.length,
            results: results
        });

    } catch (error) {
        console.error("\n❌ Error:", error.message);
        debugLog('test:error', 'Test failed', { error: error.message });
    }
}

main();

