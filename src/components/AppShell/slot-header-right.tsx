import { Route } from "@/app/navigation";
import { Group } from "@mantine/core";

import HeaderNavLink from "./internal/HeaderNavLink";
import UserMenu from "@/components/auth/user-menu";
import { useUser } from "../auth/use-user";
/**
 * DO NOT REMOVE / RENAME THIS FILE
 *
 * You may CUSTOMIZE the content of this file, but the ProofKit CLI expects
 * this file to exist and may use it to inject content for other components.
 *
 * If you don't want it to be used, you may return null or an empty fragment
 */
export function SlotHeaderRight({ routes, hideUserMenu = false }: { routes: Route[], hideUserMenu?: boolean }) {
  const { session } = useUser();

  return (
    <>
      <Group gap={5}>
        <Group gap={5} visibleFrom="xs">
          {routes
            .filter(
              (route) =>
                (session && route.visibility === "private") ||
                (!session && route.visibility === "public") ||
                route.visibility === "all"
            )
            .map((route) => (
              <HeaderNavLink key={route.label} {...route} />
            ))}
        </Group>
        {!hideUserMenu && <UserMenu />}
      </Group>
    </>
  );
}

export default SlotHeaderRight;
