/**
 * Carrier detection utilities for shipping line identification
 */

export type CarrierType = "maersk" | "msc" | "unknown";

export interface CarrierInfo {
    type: CarrierType;
    name: string;
    logo: string;
    trackingUrl: (bookingNumber: string) => string;
}

const CARRIERS: Record<CarrierType, Omit<CarrierInfo, "type">> = {
    maersk: {
        name: "Maersk",
        logo: "/Maersk Logo.svg",
        trackingUrl: (bookingNumber) =>
            `https://www.maersk.com/tracking/${bookingNumber}`,
    },
    msc: {
        name: "MSC",
        logo: "/MSC Logo Icon.png",
        trackingUrl: (bookingNumber) =>
            `https://www.msc.com/track-a-shipment?query=${bookingNumber}`,
    },
    unknown: {
        name: "Carrier",
        logo: "",
        trackingUrl: () => "#",
    },
};

/**
 * Detect carrier type from SS Line Company name
 */
export function detectCarrier(ssLineCompany: string | null | undefined): CarrierType {
    if (!ssLineCompany) return "unknown";

    const companyUpper = ssLineCompany.toUpperCase();

    // MSC detection
    if (companyUpper === "MEDITERRANEAN SHIPPING COMPANY S.A." ||
        companyUpper.includes("MEDITERRANEAN SHIPPING")) {
        return "msc";
    }

    // Maersk detection
    if (companyUpper.includes("MAERSK")) {
        return "maersk";
    }

    return "unknown";
}

/**
 * Get full carrier info from SS Line Company name
 */
export function getCarrierInfo(ssLineCompany: string | null | undefined): CarrierInfo {
    const type = detectCarrier(ssLineCompany);
    return {
        type,
        ...CARRIERS[type],
    };
}

/**
 * Check if we have API tracking data for this carrier
 */
export function hasAPITracking(ssLineCompany: string | null | undefined): boolean {
    const type = detectCarrier(ssLineCompany);
    return type === "maersk" || type === "msc";
}

