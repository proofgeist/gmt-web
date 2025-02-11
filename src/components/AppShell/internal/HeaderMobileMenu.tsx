"use client";

import { Burger, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import SlotHeaderMobileMenuContent from "../slot-header-mobile-content";
import { Route } from "@/app/navigation";

export default function HeaderMobileMenu({
  burgerColor = "brand",
  routes,
}: {
  burgerColor?: string;
  routes: Route[];
}) {
  const [opened, { toggle }] = useDisclosure(false);

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
          color={burgerColor}
        />
      </Menu.Target>
      <Menu.Dropdown w={"90%"}>
        <SlotHeaderMobileMenuContent closeMenu={toggle} routes={routes} />
      </Menu.Dropdown>
    </Menu>
  );
}
