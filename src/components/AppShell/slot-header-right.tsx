import { Route } from "@/app/navigation";
import { Group } from "@mantine/core";

import HeaderNavLink from "./internal/HeaderNavLink";
import UserMenu from "@/components/auth/user-menu";
import { useUser } from "@/hooks/use-user";
import { SessionValidationResult } from "@/server/auth/utils/session";
/**
 * DO NOT REMOVE / RENAME THIS FILE
 *
 * You may CUSTOMIZE the content of this file, but the ProofKit CLI expects
 * this file to exist and may use it to inject content for other components.
 *
 * If you don't want it to be used, you may return null or an empty fragment
 */
export function SlotHeaderRight({
  routes,
  isPublic,
  initialSession,
}: {
  routes: Route[];
  isPublic: boolean;
  initialSession: SessionValidationResult;
}) {
  const { session, user } = useUser();

  return (
    <>
      <Group gap={5}>
        <Group gap={5} visibleFrom="xs">
          {routes
            .filter((route) => {
              // Base visibility filter
              const baseVisibilityMatch =
                (session && route.visibility === "private") ||
                (!session && route.visibility === "public") ||
                route.visibility === "all";
              
              // If route requires a specific role, check user role
              if (route.requiredRole && user?.user_role !== route.requiredRole) {
                return false;
              }
              
              return baseVisibilityMatch;
            })
            .map((route) => (
              <HeaderNavLink key={route.label} {...route} />
            ))}
        </Group>
        <UserMenu isPublic={isPublic} initialSession={initialSession} />
      </Group>
    </>
  );
}

export default SlotHeaderRight;
