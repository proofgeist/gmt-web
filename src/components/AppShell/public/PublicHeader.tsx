"use client";

import { headerColor } from "@/config/theme/mantine-theme";
import { Header } from "../internal/Header";
import { publicRoutes } from "@/app/navigation";

export function PublicHeader() {
  return (
    <Header
      routes={publicRoutes}
      textColor="white"
      hideLogo={false}
      headerColor={headerColor}
    />
  );
}
