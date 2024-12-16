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

export const primaryRoutes: Route[] = [
  {
    label: "Dashboard",
    type: "link",
    href: "/",
    exactMatch: true,
    visibility: "none",
  },
  {
    label: "My Shipments",
    type: "link",
    href: "/my-shipments",
    visibility: "private",
  },
];

export const secondaryRoutes: Route[] = [];
