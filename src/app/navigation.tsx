import { ProofKitRoute, type RouteLink } from "@proofgeist/kit";

interface Route extends Omit<RouteLink, 'type'> {
  type: "link";
  visibility?: "public" | "private" | "all" | "none";
}
type VisibleRoute = Route | ProofKitRoute;

export const primaryRoutes: VisibleRoute[] = [
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

export const secondaryRoutes: ProofKitRoute[] = [];
