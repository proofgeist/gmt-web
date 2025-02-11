"use client"; 
import { Menu } from "@mantine/core";
import { useRouter } from "next/navigation";
import { UserMobileMenu } from "../auth/user-menu";
import { Route } from "@/app/navigation";

/**
 * DO NOT REMOVE / RENAME THIS FILE
 *
 * You may CUSTOMIZE the content of this file, but the ProofKit CLI expects
 * this file to exist and may use it to inject content for other components.
 *
 * If you don't want it to be used, you may return null or an empty fragment
 */
export function SlotHeaderMobileMenuContent({
  closeMenu,
  routes,
}: {
  closeMenu: () => void;
  routes: Route[];
}) {
  const router = useRouter();

  return (
    <>
      {routes
        .map((route) => (
          <Menu.Item
            key={route.label}
            leftSection={route.icon}
            onClick={() => {
              closeMenu();
              if (route.type === "function") {
                route.onClick();
              } else if (route.type === "link") {
                router.push(route.href);
              }
            }}
          >
            {route.label}
          </Menu.Item>
        ))}
      <UserMobileMenu />
    </>
  );
}

export default SlotHeaderMobileMenuContent;
