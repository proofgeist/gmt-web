/**
 * MSC Track & Trace API Integration Tests
 *
 * These tests require the MSC environment variables to be configured.
 * Run with: doppler run -- pnpm test
 */
import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

// Type definitions for MSC API responses
interface DocumentReference {
  documentReferenceType: string;
  documentReferenceValue: string;
}

interface Vessel {
  vesselIMONumber: string;
  vesselName: string;
  vesselFlag?: string;
  vesselCallSignNumber?: string;
}

interface TransportCall {
  transportCallID: string;
  carrierServiceCode: string | null;
  exportVoyageNumber: string | null;
  importVoyageNumber: string | null;
  unLocationCode: string;
  facilityCode: string;
  facilityCodeListProvider: string;
  facilityTypeCode: string;
  otherFacility: string | null;
  modeOfTransport: string;
  vessel: Vessel | null;
}

interface EventLocation {
  locationName: string;
  unLocationCode: string;
  facilityCode: string;
  facilityCodeListProvider: string;
}

interface MSCEvent {
  eventType: "EQUIPMENT" | "TRANSPORT";
  eventId: string;
  eventDateTime: string;
  eventClassifierCode: string;
  eventCreatedDateTime: string;
  description: string;
  documentReferences: DocumentReference[];
  transportCall: TransportCall;
  // Equipment event specific
  equipmentEventTypeCode?: string;
  equipmentReference?: string;
  ISOEquipmentCode?: string;
  emptyIndicatorCode?: string;
  eventLocation?: EventLocation;
  seals?: { sealNumber: string; sealSource: string }[];
  // Transport event specific
  transportEventTypeCode?: string;
  references?: unknown[];
}

interface ErrorResponse {
  error: string;
  status?: number;
  details?: string;
  message?: string;
}

// Known test data from real MSC booking
const TEST_DATA = {
  booking: "EBKG13537905",
  container: "FFAU2562268",
  bol: "MEDUJZ334684",
};

function createRequest(params: Record<string, string> = {}) {
  const url = new URL("http://localhost:3000/api/msc/track");
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return new NextRequest(url);
}

describe("MSC Track & Trace API", () => {
  describe("Parameter Validation", () => {
    it("should return 400 when no parameters provided", async () => {
      const request = createRequest();
      const response = await GET(request);
      const data = (await response.json()) as ErrorResponse;

      // If MSC is not configured, it returns 503
      if (response.status === 503) {
        expect(data.error).toBe("MSC API is not configured");
        return;
      }

      expect(response.status).toBe(400);
      expect(data.error).toContain("Missing required parameter");
    });
  });

  describe("Booking Number Search", () => {
    it("should return tracking events for valid booking number", async () => {
      const request = createRequest({ booking: TEST_DATA.booking });
      const response = await GET(request);

      // Skip if not configured
      if (response.status === 503) return;

      const data = (await response.json()) as MSCEvent[];
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);

      // Verify structure of first event
      const firstEvent = data[0];
      expect(firstEvent).toHaveProperty("eventType");
      expect(firstEvent).toHaveProperty("eventDateTime");
      expect(firstEvent).toHaveProperty("documentReferences");
    });

    it("should include booking reference in document references", async () => {
      const request = createRequest({ booking: TEST_DATA.booking });
      const response = await GET(request);

      if (response.status === 503) return;

      const data = (await response.json()) as MSCEvent[];
      const firstEvent = data[0];
      const bookingRef = firstEvent.documentReferences.find(
        (ref) => ref.documentReferenceType === "BKG"
      );
      expect(bookingRef).toBeDefined();
      expect(bookingRef?.documentReferenceValue).toBe(TEST_DATA.booking);
    });

    it("should return 404 for non-existent booking", async () => {
      const request = createRequest({ booking: "FAKE99999999" });
      const response = await GET(request);

      if (response.status === 503) return;

      const data = (await response.json()) as ErrorResponse;
      expect(response.status).toBe(404);
      expect(data.error).toBe("MSC API error");
    });
  });

  describe("Container Number Search", () => {
    it("should return tracking events for valid container number", async () => {
      const request = createRequest({ container: TEST_DATA.container });
      const response = await GET(request);

      if (response.status === 503) return;

      const data = (await response.json()) as MSCEvent[];
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);

      // Verify container reference matches
      const firstEvent = data[0];
      expect(firstEvent.equipmentReference).toBe(TEST_DATA.container);
    });
  });

  describe("Bill of Lading Search", () => {
    it("should return tracking events for valid BOL", async () => {
      const request = createRequest({ bol: TEST_DATA.bol });
      const response = await GET(request);

      if (response.status === 503) return;

      const data = (await response.json()) as MSCEvent[];
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);

      // Verify BOL reference in document references
      const firstEvent = data[0];
      const bolRef = firstEvent.documentReferences.find(
        (ref) => ref.documentReferenceType === "TRD"
      );
      expect(bolRef).toBeDefined();
      expect(bolRef?.documentReferenceValue).toBe(TEST_DATA.bol);
    });
  });

  describe("Event Data Structure", () => {
    it("should return properly structured EQUIPMENT events", async () => {
      const request = createRequest({ booking: TEST_DATA.booking });
      const response = await GET(request);

      if (response.status === 503) return;

      const data = (await response.json()) as MSCEvent[];
      const equipmentEvent = data.find((e) => e.eventType === "EQUIPMENT");
      expect(equipmentEvent).toBeDefined();
      expect(equipmentEvent).toHaveProperty("equipmentEventTypeCode");
      expect(equipmentEvent).toHaveProperty("equipmentReference");
      expect(equipmentEvent).toHaveProperty("emptyIndicatorCode");
      expect(equipmentEvent).toHaveProperty("transportCall");
      expect(equipmentEvent).toHaveProperty("eventLocation");
    });

    it("should return properly structured TRANSPORT events", async () => {
      const request = createRequest({ booking: TEST_DATA.booking });
      const response = await GET(request);

      if (response.status === 503) return;

      const data = (await response.json()) as MSCEvent[];
      const transportEvent = data.find((e) => e.eventType === "TRANSPORT");
      expect(transportEvent).toBeDefined();
      expect(transportEvent).toHaveProperty("transportEventTypeCode");
      expect(transportEvent).toHaveProperty("transportCall");
      expect(transportEvent?.transportCall).toHaveProperty("vessel");
    });

    it("should include vessel information for vessel events", async () => {
      const request = createRequest({ booking: TEST_DATA.booking });
      const response = await GET(request);

      if (response.status === 503) return;

      const data = (await response.json()) as MSCEvent[];
      const vesselEvent = data.find((e) => e.transportCall?.vessel !== null);
      expect(vesselEvent).toBeDefined();
      expect(vesselEvent?.transportCall.vessel).toHaveProperty("vesselIMONumber");
      expect(vesselEvent?.transportCall.vessel).toHaveProperty("vesselName");
    });
  });

  describe("Event Timeline", () => {
    it("should return events in chronological order (most recent first)", async () => {
      const request = createRequest({ booking: TEST_DATA.booking });
      const response = await GET(request);

      if (response.status === 503) return;

      const data = (await response.json()) as MSCEvent[];

      // Events should be sorted with most recent first
      for (let i = 0; i < data.length - 1; i++) {
        const currentDate = new Date(data[i].eventDateTime);
        const nextDate = new Date(data[i + 1].eventDateTime);
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });

    it("should include key milestones for completed shipment", async () => {
      const request = createRequest({ booking: TEST_DATA.booking });
      const response = await GET(request);

      if (response.status === 503) return;

      const data = (await response.json()) as MSCEvent[];
      const eventCodes = data.map(
        (e) => e.equipmentEventTypeCode ?? e.transportEventTypeCode
      );

      // Should have loading and discharge events
      expect(eventCodes).toContain("LOAD"); // Loaded on vessel
      expect(eventCodes).toContain("DISC"); // Discharged from vessel
      expect(eventCodes).toContain("GTIN"); // Gate in
      expect(eventCodes).toContain("GTOT"); // Gate out
    });
  });
});
