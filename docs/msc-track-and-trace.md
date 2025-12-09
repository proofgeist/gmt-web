# MSC Track & Trace API - FileMaker Integration Guide

This document explains how to use the GMT Web proxy endpoint to access MSC's Track & Trace API from FileMaker.

## Why Use the Proxy?

The original MSC API (DCSA T&T v2.2) uses **certificate-based OAuth 2.0 authentication**, which requires:
- RSA private key signing
- JWT assertion generation  
- Token caching and refresh logic

FileMaker cannot natively handle this authentication flow. Our proxy endpoint handles all the complexity, giving FileMaker a simple REST endpoint to call.

---

## Endpoint Overview

| | Original MSC API | GMT Proxy Endpoint |
|---|---|---|
| **Base URL** | `https://api.tech.msc.com/msc/trackandtrace/v2.2/events` | `https://www.mygmt.com/api/msc/track` |
| **Authentication** | Certificate + OAuth 2.0 Bearer Token | None (handled internally) |
| **Parameters** | `equipmentReference`, `transportDocumentReference`, `carrierBookingReference` | `container`, `bol`, `booking` |

---

## FileMaker Script: Insert From URL

### Search by Container Number

```
Set Variable [ $url ; "https://www.mygmt.com/api/msc/track?container=" & Table::ContainerNumber ]
Insert from URL [ Select ; With Dialog: Off ; Target: $result ; $url ; 
  cURL options: "--request GET --header \"Content-Type: application/json\"" ]
```

### Search by Bill of Lading

```
Set Variable [ $url ; "https://www.mygmt.com/api/msc/track?bol=" & Table::BillOfLading ]
Insert from URL [ Select ; With Dialog: Off ; Target: $result ; $url ; 
  cURL options: "--request GET --header \"Content-Type: application/json\"" ]
```

### Search by Booking Number

```
Set Variable [ $url ; "https://www.mygmt.com/api/msc/track?booking=" & Table::BookingNumber ]
Insert from URL [ Select ; With Dialog: Off ; Target: $result ; $url ; 
  cURL options: "--request GET --header \"Content-Type: application/json\"" ]
```

### Search with Filters (like Maersk API)

**Get only TRANSPORT events (vessel arrivals/departures):**
```
Set Variable [ $url ; "https://www.mygmt.com/api/msc/track?booking=" & Table::BookingNumber & "&eventType=TRANSPORT" ]
Insert from URL [ Select ; With Dialog: Off ; Target: $result ; $url ; 
  cURL options: "--request GET --header \"Content-Type: application/json\"" ]
```

**Get only vessel arrival events:**
```
Set Variable [ $url ; "https://www.mygmt.com/api/msc/track?booking=" & Table::BookingNumber & "&transportEventTypeCode=ARRI" ]
Insert from URL [ Select ; With Dialog: Off ; Target: $result ; $url ; 
  cURL options: "--request GET --header \"Content-Type: application/json\"" ]
```

**Get only LOAD and DISC events (vessel loading/discharge):**
```
Set Variable [ $url ; "https://www.mygmt.com/api/msc/track?booking=" & Table::BookingNumber & "&equipmentEventTypeCode=LOAD,DISC" ]
Insert from URL [ Select ; With Dialog: Off ; Target: $result ; $url ; 
  cURL options: "--request GET --header \"Content-Type: application/json\"" ]
```

---

## Parameter Mapping

### Required Parameters (pick one)

| GMT Proxy Parameter | Original DCSA Parameter | Description |
|---|---|---|
| `container` | `equipmentReference` | Container number (e.g., `MEDU1234567`) |
| `bol` | `transportDocumentReference` | Bill of Lading number |
| `booking` | `carrierBookingReference` | Booking reference number |

### Optional Filter Parameters

| Parameter | Values | Description |
|---|---|---|
| `eventType` | `TRANSPORT`, `EQUIPMENT`, `SHIPMENT` | Filter by event type (comma-separated for multiple) |
| `equipmentEventTypeCode` | `LOAD`, `DISC`, `GTIN`, `GTOT` | Filter equipment events by code |
| `transportEventTypeCode` | `ARRI`, `DEPA` | Filter transport events by code |
| `limit` | Number | Max records to return |
| `sort` | Field name | Sort by field |

**Note:** Only one required parameter should be provided per request. Filters can be combined.

---

## Response Format

The response is a JSON array of tracking events, identical to the DCSA T&T v2.2 specification.

### Event Types

| eventType | Description |
|---|---|
| `EQUIPMENT` | Container/equipment events (gate in/out, load/discharge) |
| `TRANSPORT` | Vessel movement events (arrival, departure) |

### Equipment Event Type Codes

| Code | Description |
|---|---|
| `LOAD` | Loaded onto vessel |
| `DISC` | Discharged from vessel |
| `GTIN` | Gate in (arrived at facility) |
| `GTOT` | Gate out (departed facility) |

### Transport Event Type Codes

| Code | Description |
|---|---|
| `ARRI` | Vessel arrival |
| `DEPA` | Vessel departure |

---

## Example Response

```json
[
  {
    "eventType": "EQUIPMENT",
    "equipmentEventTypeCode": "DISC",
    "equipmentReference": "FFAU2562268",
    "ISOEquipmentCode": "4510",
    "emptyIndicatorCode": "LADEN",
    "description": "Import Discharged from Vessel",
    "eventDateTime": "2025-08-29T01:35:00-06:00",
    "transportCall": {
      "unLocationCode": "CRCAL",
      "facilityCode": "SPCAD",
      "modeOfTransport": "VESSEL",
      "vessel": {
        "vesselIMONumber": "9337597",
        "vesselName": "GALANI",
        "vesselFlag": "MT"
      }
    },
    "documentReferences": [
      { "documentReferenceType": "BKG", "documentReferenceValue": "EBKG13537905" },
      { "documentReferenceType": "TRD", "documentReferenceValue": "MEDUJZ334684" }
    ],
    "eventLocation": {
      "locationName": "CALDERA",
      "unLocationCode": "CRCAL"
    }
  }
]
```

---

## Parsing Events in FileMaker

### Get Event Count
```
JSONListKeys ( $result ; "" )
// Returns: 0¶1¶2¶3... (one per event)
```

### Get First Event Details
```
// Event type
JSONGetElement ( $result ; "[0].eventType" )

// Container number  
JSONGetElement ( $result ; "[0].equipmentReference" )

// Description
JSONGetElement ( $result ; "[0].description" )

// Date/Time
JSONGetElement ( $result ; "[0].eventDateTime" )

// Location
JSONGetElement ( $result ; "[0].eventLocation.locationName" )

// Vessel name (if applicable)
JSONGetElement ( $result ; "[0].transportCall.vessel.vesselName" )
```

### Loop Through All Events
```
Set Variable [ $count ; ValueCount ( JSONListKeys ( $result ; "" ) ) ]
Set Variable [ $i ; 0 ]
Loop
  Exit Loop If [ $i ≥ $count ]
  Set Variable [ $event ; JSONGetElement ( $result ; "[" & $i & "]" ) ]
  Set Variable [ $eventType ; JSONGetElement ( $event ; "eventType" ) ]
  Set Variable [ $description ; JSONGetElement ( $event ; "description" ) ]
  Set Variable [ $dateTime ; JSONGetElement ( $event ; "eventDateTime" ) ]
  // ... process event ...
  Set Variable [ $i ; $i + 1 ]
End Loop
```

---

## Error Handling

### HTTP Status Codes

| Status | Meaning | FileMaker Action |
|---|---|---|
| `200` | Success | Parse JSON response |
| `400` | Missing parameter | Check that container/bol/booking is provided |
| `404` | Not found | Container/BOL/Booking doesn't exist in MSC system |
| `429` | Rate limited | Wait and retry (max 1,200 calls per 5 min) |
| `500` | Server error | Log error, retry later |
| `503` | MSC not configured | Contact administrator |

### Error Response Format
```json
{
  "error": "MSC API error",
  "status": 404,
  "details": "{\"message\":\"Container, Bill of Lading, or Booking: not found\"}"
}
```

### FileMaker Error Check
```
If [ Get ( LastExternalErrorDetail ) ≠ "" or PatternCount ( $result ; "\"error\":" ) > 0 ]
  Set Variable [ $errorMsg ; JSONGetElement ( $result ; "error" ) ]
  Show Custom Dialog [ "Error" ; $errorMsg ]
End If
```

---

## Rate Limits

MSC enforces these limits:
- **1,200 calls per 5 minutes**
- **100,000 calls per day**

The proxy caches authentication tokens (valid ~1 hour), so repeated calls don't consume extra auth requests.

---

## Differences from Direct DCSA API

| Feature | Direct DCSA API | GMT Proxy |
|---|---|---|
| Authentication | Complex (certificate + OAuth) | None required |
| Token management | Manual | Automatic |
| Parameter names | Long (`equipmentReference`) | Short (`container`) |
| Error handling | Raw MSC errors | Simplified JSON |
| Rate limiting | Your responsibility | Shared pool |

---

## Testing

Use these known-good test values:

| Parameter | Test Value |
|---|---|
| `booking` | `EBKG13537905` |
| `container` | `FFAU2562268` |
| `bol` | `MEDUJZ334684` |

Example test URL:
```
https://www.mygmt.com/api/msc/track?booking=EBKG13537905
```

---

## Environment Variables (for Deployment)

These must be set in Vercel/Doppler:

| Variable | Description |
|---|---|
| `MSC_CLIENT_ID` | Azure AD Application ID |
| `MSC_TENANT_ID` | Azure AD Tenant ID |
| `MSC_SCOPE` | API scope (ends in `/.default`) |
| `MSC_CERT_THUMBPRINT` | SHA-1 thumbprint of certificate (40 hex chars) |
| `MSC_CERT_PRIVATE_KEY` | Base64-encoded PEM private key |

