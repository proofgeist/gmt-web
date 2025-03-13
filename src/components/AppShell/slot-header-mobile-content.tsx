"use client"; 
import { Menu, Collapse, Group, Text, Box } from "@mantine/core";
import { useRouter } from "next/navigation";
import { UserMobileMenu } from "../auth/user-menu";
import { Route } from "@/app/navigation";
import { useState } from "react";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

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
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <>
      {routes.map((route) => {
        // If the route has subItems, render a submenu
        if (route.subItems && route.subItems.length > 0) {
          const isOpen = openSubmenu === route.label;

          return (
            <Box key={route.label}>
              <Menu.Item
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  toggleSubmenu(route.label);

                  // Only navigate if it's a link and we're closing the submenu
                  if (openSubmenu === route.label) {
                    if (route.type === "link") {
                      router.push(route.href);
                      closeMenu();
                    } else if (route.type === "function") {
                      route.onClick();
                      closeMenu();
                    }
                  }
                }}
                leftSection={route.icon}
                rightSection={
                  <Group>
                    {isOpen ?
                      <IconChevronUp size={16} />
                    : <IconChevronDown size={16} />}
                  </Group>
                }
              >
                {route.label}
              </Menu.Item>

              <Collapse in={isOpen}>
                <Box style={{ paddingLeft: 20 }}>
                  {route.subItems.map((subItem) => (
                    <Menu.Item
                      key={subItem.label}
                      leftSection={subItem.icon}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event bubbling
                        router.push(subItem.href);
                        closeMenu();
                      }}
                    >
                      {subItem.label}
                    </Menu.Item>
                  ))}
                </Box>
              </Collapse>
            </Box>
          );
        }

        // For routes without subItems, use the original implementation
        return (
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
        );
      })}
      <UserMobileMenu />
    </>
  );
}

export default SlotHeaderMobileMenuContent;
