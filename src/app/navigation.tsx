import {
  ContactModal,
} from "@/components/modals/contact/contact";
import { openModal } from "@mantine/modals";

export interface RouteLink {
  label: string;
  type: "link";
  href: string;
  icon?: React.ReactNode;
  /** If true, the route will only be considered active if the path is exactly this value. */
  exactMatch?: boolean;
  visibility?: "public" | "private" | "all" | "none";
}

export interface RouteFunction {
  label: string;
  type: "function";
  icon?: React.ReactNode;
  onClick: () => void;
  /** If true, the route will only be considered active if the path is exactly this value. */
  exactMatch?: boolean;
  visibility?: "public" | "private" | "all" | "none";
}

export type Route = RouteLink | RouteFunction;

export const publicRoutes: Route[] = [
  {
    label: "About",
    type: "link",
    href: "/about",
    visibility: "public",
  },
  {
    label: "Contact",
    type: "function",
    onClick: () =>
      openModal({
        id: "contact",
        title: "Contact Us",
        children: <ContactModal />,
      }),
    visibility: "public",
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
