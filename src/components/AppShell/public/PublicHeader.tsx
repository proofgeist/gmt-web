"use client";

import { Header } from "../internal/Header";
import { publicRoutes } from "@/app/navigation";

export function PublicHeader() {
  return <Header routes={publicRoutes} isPublic={true} />;
}
