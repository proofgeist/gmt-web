"use client";

import { Burger, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Header.module.css";

import SlotHeaderMobileMenuContent from "../slot-header-mobile-content";
import { Route } from "@/app/navigation";
import { SessionValidationResult } from "@/server/auth/utils/session";

export default function HeaderMobileMenu({
  burgerColor = "brand.9",
  routes,
  initialSession,
}: {
  burgerColor?: string;
  routes: Route[];
  initialSession: SessionValidationResult;
}) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Menu
      opened={opened}
      onClose={toggle}
      closeOnItemClick={false}
      styles={{ item: { padding: "1rem" } }}
      shadow="md"
      radius="md"
      classNames={{ dropdown: classes.menuDropdown }}
    >
      <Menu.Target>
        <Burger
          opened={opened}
          hiddenFrom="sm"
          onClick={toggle}
          size="sm"
          color={burgerColor}
        />
      </Menu.Target>
      <Menu.Dropdown w={"90%"}>
        <SlotHeaderMobileMenuContent closeMenu={toggle} routes={routes} initialSession={initialSession} />
      </Menu.Dropdown>
    </Menu>
  );
}
