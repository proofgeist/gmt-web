import { type ProofKitRoute } from "@proofgeist/kit";

export const primaryRoutes: ProofKitRoute[] = [
  // {
  //   label: "Dashboard",
  //   type: "link",
  //   href: "/",
  //   exactMatch: true,
  // },
  {
    label: "My Shipments",
    type: "link",
    href: "/bookings-report",
  },
];

export const secondaryRoutes: ProofKitRoute[] = [];
