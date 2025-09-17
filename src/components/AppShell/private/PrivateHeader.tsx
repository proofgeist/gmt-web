'use client';

import { Header } from "../internal/Header";
import { privateRoutes } from "@/app/navigation";
import { SessionValidationResult } from "@/server/auth/utils/session";

export function PrivateHeader({ initialSession }: { initialSession: SessionValidationResult }) {
  return <Header routes={privateRoutes} isPublic={false} initialSession={initialSession} />;
} 