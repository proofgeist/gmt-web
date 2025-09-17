"use client";

import { Header } from "../internal/Header";
import { publicRoutes } from "@/app/navigation";
import { SessionValidationResult } from "@/server/auth/utils/session";

export function PublicHeader({ initialSession }: { initialSession: SessionValidationResult }) {
  return <Header routes={publicRoutes} isPublic={true} initialSession={initialSession} />;
}
