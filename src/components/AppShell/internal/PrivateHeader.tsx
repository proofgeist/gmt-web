'use client';

import { Header } from "./Header";
import { privateRoutes } from "@/app/navigation";

export function PrivateHeader() {
  return <Header routes={privateRoutes} />;
} 