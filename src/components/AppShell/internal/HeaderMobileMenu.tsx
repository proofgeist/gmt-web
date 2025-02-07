"use client";

import { Burger, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { usePathname } from "next/navigation";
import { primaryRoutes } from "@/app/navigation";

import SlotHeaderMobileMenuContent from "../slot-header-mobile-content";

export default function HeaderMobileMenu() {
  const [opened, { toggle }] = useDisclosure(false);
  const pathname = usePathname();
  const isPublicRoute = primaryRoutes.some(
    (route) =>
      route.type === "link" &&
      (route.visibility === "public" || route.visibility === "none") &&
      pathname === route.href
  );

  return (
    <Menu
      opened={opened}
      onClose={toggle}
      styles={{ item: { padding: "1rem" } }}
      shadow="md"
      radius="md"
    >
      <Menu.Target>
        <Burger
          opened={opened}
          hiddenFrom="sm"
          onClick={toggle}
          size="sm"
          color={isPublicRoute ? "white" : "brand"}
        />
      </Menu.Target>
      <Menu.Dropdown w={"90%"}>
        <SlotHeaderMobileMenuContent closeMenu={toggle} />
      </Menu.Dropdown>
    </Menu>
  );
}
