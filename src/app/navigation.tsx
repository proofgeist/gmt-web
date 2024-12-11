import { type ProofKitRoute } from "@proofgeist/kit";



export const primaryRoutes: ProofKitRoute[] = [
  {
    label: "Dashboard",
    type: "link",
    href: "/",
    exactMatch: true,
    isPublic: true,
  },
  {
    label: "My Shipments",
    type: "link",
    href: "/my-shipments",
  },
];

export const secondaryRoutes: ProofKitRoute[] = [];
