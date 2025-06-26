'use client';

import { Header } from "../internal/Header";
import { privateRoutes } from "@/app/navigation";

export function PrivateHeader() {
  return <Header routes={privateRoutes} isPublic={false} />;
} 