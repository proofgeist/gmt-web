import {
  ContactModal,
} from "@/components/modals/contact/contact";
import { yellowtail } from "@/config/theme/fonts";
import { openModal } from "@mantine/modals";
import {
  IconShip,
  IconGlobe,
  IconTruck,
  IconWorld,
  IconPackage,
  IconInfoCircle,
  IconPhone,
} from "@tabler/icons-react";

export interface SubRouteLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  exactMatch?: boolean;
}

export interface RouteLink {
  label: string;
  type: "link";
  href: string;
  icon?: React.ReactNode;
  /** If true, the route will only be considered active if the path is exactly this value. */
  exactMatch?: boolean;
  visibility?: "public" | "private" | "all" | "none";
  customStyles?: string;
  component?: React.ReactNode;
  subItems?: SubRouteLink[];
}

export interface RouteFunction {
  label: string;
  type: "function";
  icon?: React.ReactNode;
  onClick: () => void;
  /** If true, the route will only be considered active if the path is exactly this value. */
  exactMatch?: boolean;
  visibility?: "public" | "private" | "all" | "none";
  customStyles?: string;
  component?: React.ReactNode;
  subItems?: SubRouteLink[];
}

export type Route = RouteLink | RouteFunction;

export const publicRoutes: Route[] = [
  {
    label: "About",
    type: "link",
    href: "/about",
    visibility: "all",
    icon: <IconInfoCircle size={18} />,
    subItems: [
      {
        label: "Ocean Freight",
        href: "/about/ocean-freight",
        icon: <IconShip size={18} />,
      },
      {
        label: "Global Network",
        href: "/about/global-network",
        icon: <IconGlobe size={18} />,
      },
      {
        label: "Land Transport",
        href: "/about/land-transport",
        icon: <IconTruck size={18} />,
      },
      {
        label: "Worldwide Service",
        href: "/about/worldwide-service",
        icon: <IconWorld size={18} />,
      },
      {
        label: "Custom Solutions",
        href: "/about/custom-solutions",
        icon: <IconPackage size={18} />,
      },
    ],
  },
  {
    label: "Contact",
    type: "function",
    icon: <IconPhone size={18} />,
    onClick: () =>
      openModal({
        id: "contact",
        title: "Contact Us",
        children: <ContactModal />,
      }),
    visibility: "all",
  },
];

export const privateRoutes: Route[] = [
  {
    label: "Dashboard",
    type: "link",
    href: "/dashboard",
    visibility: "private",
  },
  {
    label: "My Shipments",
    type: "link",
    href: "/my-shipments",
    visibility: "private",
  },
];

// Keep this route separate since it has "none" visibility
export const homeRoute: Route = {
  label: "Home",
  type: "link",
  href: "/",
  exactMatch: true,
  visibility: "none",
};

export const secondaryRoutes: Route[] = [];
