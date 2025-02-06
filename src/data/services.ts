import {
  IconShip,
  IconGlobe,
  IconTruck,
  IconWorld,
  IconPackage,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

export interface ServiceData {
  icon: Icon;
  title: string;
  description: string;
  detailedDescription: string;
  features: string[];
}

export const services: ServiceData[] = [
  {
    icon: IconShip,
    title: "Ocean Freight",
    description:
      "Maritime shipping solutions with competitive rates and flexible scheduling across major global routes.",
    detailedDescription:
      "Our ocean freight services provide comprehensive maritime logistics solutions designed to meet your specific cargo requirements. We leverage our strong relationships with major carriers to ensure reliable and cost-effective transportation across the world's major shipping lanes.",
    features: [
      "FCL (Full Container Load) and LCL (Less than Container Load) services",
      "Real-time shipment tracking and monitoring",
      "Specialized container options for temperature-sensitive cargo",
      "Port-to-port and door-to-door delivery options",
      "Custom documentation and compliance support",
      "Competitive rates through carrier partnerships",
    ],
  },
  {
    icon: IconGlobe,
    title: "Global Network",
    description:
      "Extensive network of partners worldwide ensuring seamless logistics operations.",
    detailedDescription:
      "Our vast global network connects you to every major market and logistics hub worldwide. With strategic partnerships and local expertise in key regions, we ensure your cargo moves efficiently across borders and continents.",
    features: [
      "Presence in over 150 countries worldwide",
      "Local expertise and support in major markets",
      "Integrated customs clearance services",
      "24/7 global coordination centers",
      "Multilingual support teams",
      "Strategic partnerships with regional specialists",
    ],
  },
  {
    icon: IconTruck,
    title: "Land Transport",
    description:
      "Comprehensive inland transportation with door-to-door delivery and real-time tracking.",
    detailedDescription:
      "Our land transport solutions offer seamless connectivity across continents with a modern fleet and advanced tracking capabilities. We provide flexible and reliable ground transportation services tailored to your specific needs.",
    features: [
      "Nationwide trucking and intermodal services",
      "GPS-enabled fleet tracking system",
      "Express and standard delivery options",
      "Cross-border transportation expertise",
      "Specialized equipment for oversized cargo",
      "Eco-friendly transport solutions",
    ],
  },
  {
    icon: IconWorld,
    title: "Worldwide Service",
    description:
      "24/7 customer support across multiple time zones for reliable cargo delivery.",
    detailedDescription:
      "Our round-the-clock worldwide service ensures your shipments are monitored and supported at every step of their journey. With dedicated teams across different time zones, we provide continuous support and rapid response to any situations that may arise.",
    features: [
      "24/7 customer service availability",
      "Dedicated account managers",
      "Proactive shipment status updates",
      "Emergency response team",
      "Digital booking and documentation platform",
      "Customized reporting and analytics",
    ],
  },
  {
    icon: IconPackage,
    title: "Custom Solutions",
    description:
      "Tailored logistics solutions for specialized cargo and unique routing requirements.",
    detailedDescription:
      "We specialize in developing customized logistics solutions that address your unique challenges. Our team of experts works closely with you to create tailored strategies that optimize your supply chain and meet specific industry requirements.",
    features: [
      "Project cargo handling expertise",
      "Industry-specific compliance solutions",
      "Value-added services and packaging",
      "Supply chain optimization consulting",
      "Custom routing and scheduling",
      "Specialized handling for sensitive cargo",
    ],
  },
];
