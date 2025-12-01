/**
 * DCSA Track & Trace v2.2.0 Type Definitions
 * Based on: https://app.swaggerhub.com/apis/dcsaorg/DCSA_TNT/2.2.0
 *
 * These types represent the response format from MSC's Track & Trace API
 * which implements the DCSA (Digital Container Shipping Association) standard.
 */

// ============================================================================
// Enums
// ============================================================================

/** Event type discriminator */
export type EventType = "SHIPMENT" | "TRANSPORT" | "EQUIPMENT";

/** Equipment event type codes */
export type EquipmentEventTypeCode =
    | "LOAD" // Loaded onto vessel
    | "DISC" // Discharged from vessel
    | "GTIN" // Gate in (arrived at facility)
    | "GTOT" // Gate out (departed facility)
    | "STUF" // Stuffed (cargo loaded into container)
    | "STRP" // Stripped (cargo unloaded from container)
    | "PICK" // Pick-up
    | "DROP" // Drop-off
    | "INSP" // Inspected
    | "RSEA" // Resealed
    | "RMVD"; // Removed

/** Transport event type codes */
export type TransportEventTypeCode =
    | "ARRI" // Arrival
    | "DEPA"; // Departure

/** Shipment event type codes */
export type ShipmentEventTypeCode =
    | "RECE" // Received
    | "DRFT" // Drafted
    | "PENA" // Pending approval
    | "PENU" // Pending update
    | "REJE" // Rejected
    | "APPR" // Approved
    | "ISSU" // Issued
    | "SURR" // Surrendered
    | "SUBM" // Submitted
    | "VOID" // Voided
    | "CONF" // Confirmed
    | "REQS" // Requested
    | "CMPL" // Completed
    | "HOLD" // On hold
    | "RELS"; // Released

/** Event classifier code */
export type EventClassifierCode =
    | "PLN" // Planned
    | "ACT" // Actual
    | "REQ" // Requested
    | "EST"; // Estimated

/** Empty indicator code */
export type EmptyIndicatorCode = "EMPTY" | "LADEN";

/** Mode of transport */
export type ModeOfTransport =
    | "VESSEL"
    | "RAIL"
    | "TRUCK"
    | "BARGE";

/** Facility type code */
export type FacilityTypeCode =
    | "BOCR" // Border crossing
    | "CLOC" // Customer location
    | "COFS" // Container freight station
    | "COYA" // Container yard
    | "DEPO" // Depot
    | "INTE" // Inland terminal
    | "POTE" // Port terminal
    | "PBPL" // Pilot boarding place
    | "BRTH"; // Berth

/** Document reference type */
export type DocumentReferenceType =
    | "BKG" // Booking reference
    | "TRD" // Transport document reference (Bill of Lading)
    | "SHI"; // Shipping instruction

/** Seal source */
export type SealSource =
    | "CAR" // Carrier
    | "SHI" // Shipper
    | "PHY" // Phytosanitary
    | "VET" // Veterinary
    | "CUS" // Customs
    | "TER"; // Terminal

/** Facility code list provider */
export type FacilityCodeListProvider =
    | "BIC"  // Bureau International des Containers
    | "SMDG" // Ship-planning Message Development Group
    | "DCSA"; // Digital Container Shipping Association

// ============================================================================
// Sub-types
// ============================================================================

/** Vessel information */
export interface Vessel {
    vesselIMONumber: string;
    vesselName: string;
    vesselFlag?: string;
    vesselCallSignNumber?: string;
    vesselOperatorCarrierCode?: string;
    vesselOperatorCarrierCodeListProvider?: string;
}

/** Transport call - represents a stop on a vessel's voyage */
export interface TransportCall {
    transportCallID: string;
    carrierServiceCode: string | null;
    exportVoyageNumber: string | null;
    importVoyageNumber: string | null;
    unLocationCode: string;
    facilityCode: string;
    facilityCodeListProvider: FacilityCodeListProvider;
    facilityTypeCode: FacilityTypeCode;
    otherFacility: string | null;
    modeOfTransport: ModeOfTransport;
    vessel: Vessel | null;
}

/** Event location */
export interface EventLocation {
    locationName: string;
    unLocationCode: string;
    facilityCode?: string;
    facilityCodeListProvider?: FacilityCodeListProvider;
    latitude?: string;
    longitude?: string;
    address?: {
        name?: string;
        street?: string;
        streetNumber?: string;
        floor?: string;
        postCode?: string;
        city?: string;
        stateRegion?: string;
        country?: string;
    };
}

/** Document reference */
export interface DocumentReference {
    documentReferenceType: DocumentReferenceType;
    documentReferenceValue: string;
}

/** Seal information */
export interface Seal {
    sealNumber: string;
    sealSource: SealSource;
    sealType?: string;
}

/** Reference (additional references) */
export interface Reference {
    referenceType: string;
    referenceValue: string;
}

// ============================================================================
// Base Event
// ============================================================================

/** Common fields for all event types */
export interface BaseEvent {
    eventID: string;
    eventDateTime: string;
    eventCreatedDateTime: string;
    eventClassifierCode: EventClassifierCode;
    transportCall: TransportCall;
    documentReferences: DocumentReference[];
    references?: Reference[];
}

// ============================================================================
// Event Types
// ============================================================================

/** Equipment event - container/equipment movements */
export interface EquipmentEvent extends BaseEvent {
    eventType: "EQUIPMENT";
    equipmentEventTypeCode: EquipmentEventTypeCode;
    equipmentReference: string;
    ISOEquipmentCode?: string;
    emptyIndicatorCode: EmptyIndicatorCode;
    eventLocation: EventLocation;
    seals: Seal[];
    description: string;
}

/** Transport event - vessel arrivals/departures */
export interface TransportEvent extends BaseEvent {
    eventType: "TRANSPORT";
    transportEventTypeCode: TransportEventTypeCode;
    description: string;
    delayReasonCode?: string;
    changeRemark?: string;
}

/** Shipment event - document status changes */
export interface ShipmentEvent extends BaseEvent {
    eventType: "SHIPMENT";
    shipmentEventTypeCode: ShipmentEventTypeCode;
    documentTypeCode: string;
    documentID?: string;
    reason?: string;
}

// ============================================================================
// Union Type
// ============================================================================

/** Any DCSA Track & Trace event */
export type TrackingEvent = EquipmentEvent | TransportEvent | ShipmentEvent;

/** API Response - array of tracking events */
export type TrackingEventsResponse = TrackingEvent[];

// ============================================================================
// Error Response
// ============================================================================

/** MSC API error response */
export interface MSCErrorResponse {
    httpMethod: string;
    requestUri: string;
    statusCode: number;
    statusCodeText: string;
    errorDateTime: string;
    errors: Array<{
        reason: string;
        message: string;
    }>;
}

/** Proxy error response */
export interface ProxyErrorResponse {
    error: string;
    status?: number;
    details?: string;
    message?: string;
}

// ============================================================================
// Type Guards
// ============================================================================

/** Check if event is an Equipment event */
export function isEquipmentEvent(event: TrackingEvent): event is EquipmentEvent {
    return event.eventType === "EQUIPMENT";
}

/** Check if event is a Transport event */
export function isTransportEvent(event: TrackingEvent): event is TransportEvent {
    return event.eventType === "TRANSPORT";
}

/** Check if event is a Shipment event */
export function isShipmentEvent(event: TrackingEvent): event is ShipmentEvent {
    return event.eventType === "SHIPMENT";
}

