"use client";

import { Header } from "../internal/Header";
import { publicRoutes } from "@/app/navigation";
import { useUser } from "@/components/auth/use-user";

export function PublicHeader() {
  const { user } = useUser();
  const isAuthenticated = !!user;

  return (
    <Header
      routes={publicRoutes}
      hideLogo={false}
      hideUserMenu={isAuthenticated}
    />
  );
}
