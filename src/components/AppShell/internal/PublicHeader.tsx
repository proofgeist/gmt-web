"use client";

import { Header } from "./Header";
import { publicRoutes } from "@/app/navigation";

export function PublicHeader() {
  return <Header routes={publicRoutes} textColor="white" />;
}
