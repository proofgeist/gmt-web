'use client';

import { Header } from "../internal/Header";
import { privateRoutes } from "@/app/navigation";
import { headerColor } from "@/config/theme/mantine-theme";

export function PrivateHeader() {
  return <Header routes={privateRoutes} />;
} 