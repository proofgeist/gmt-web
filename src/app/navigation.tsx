import { type ProofKitRoute } from "@proofgeist/kit";



export const primaryRoutes: ProofKitRoute[] = [
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
