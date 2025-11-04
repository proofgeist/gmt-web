import { ContactModal } from "@/components/modals/contact/contact";
import { openModal } from "@mantine/modals";
import {
  IconShip,
  IconGlobe,
  IconTruck,
  IconWorld,
  IconInfoCircle,
  IconPhone,
  IconShield,
  IconRuler,
  IconLayoutDashboard,
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
  /** If specified, the route will only be visible to users with this role. */
  requiredRole?: string;
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
  /** If specified, the route will only be visible to users with this role. */
  requiredRole?: string;
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
        label: "Ocean Transportation",
        href: "/about/ocean-transportation",
        icon: <IconShip size={18} />,
      },
      {
        label: "Inland Transportation",
        href: "/about/inland-transportation",
        icon: <IconTruck size={18} />,
      },
      {
        label: "Fumigation",
        href: "/about/fumigation",
        icon: <IconGlobe size={18} />,
      },
      {
        label: "Cargo Insurance",
        href: "/about/cargo-insurance",
        icon: <IconShield size={18} />,
      },
      {
        label: "Customs Brokerage",
        href: "/about/customs-brokerage",
        icon: <IconWorld size={18} />,
      },
      {
        label: "Container Sizes",
        href: "/about/container-sizes",
        icon: <IconRuler size={18} />,
      },
      {
        label: "Sustainability",
        href: "/about/sustainability",
        icon: <IconGlobe size={18} />,
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
  }
];

export const privateRoutes: Route[] = [
  {
    label: "Dashboard",
    type: "link",
    href: "/dashboard",
    visibility: "private",
    icon: <IconLayoutDashboard size={18} />,
    exactMatch: false,
  },
];

export const secondaryRoutes: Route[] = [];
