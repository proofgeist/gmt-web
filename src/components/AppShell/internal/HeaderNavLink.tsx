"use client";

import { type Route, SubRouteLink } from "@/app/navigation";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Menu, Box } from "@mantine/core";
import Link from "next/link";
import classes from "./Header.module.css";
import { IconChevronDown } from "@tabler/icons-react";

export default function HeaderNavLink(route: Route) {
  const pathname = usePathname();
  const [opened, setOpened] = useState(false);

  // If the route has subItems, render a dropdown menu
  if (route.subItems && route.subItems.length > 0) {
    const isActive =
      route.type === "link" &&
      (route.exactMatch ?
        pathname === route.href
      : pathname.startsWith(route.href));

    // Check if any subItem is active
    const isAnySubItemActive = route.subItems.some((subItem) =>
      subItem.exactMatch ?
        pathname === subItem.href
      : pathname.startsWith(subItem.href)
    );

    return (
      <Menu
        opened={opened}
        onChange={setOpened}
        trigger="hover"
        openDelay={50}
        closeDelay={200}
        position="bottom-start"
        offset={5}
        classNames={{ dropdown: classes.menuDropdown }}
      >
        <Menu.Target>
          <Box>
            {route.type === "link" ?
              <Link
                href={route.href}
                prefetch={true}
                className={`${classes.link} ${route.customStyles ? classes[route.customStyles] : ""}`}
                data-active={isActive || isAnySubItemActive || undefined}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {route.component || route.label}
                  <IconChevronDown size={14} />
                </span>
              </Link>
            : <button
                className={`${classes.link} ${route.customStyles}`}
                onClick={route.onClick}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  {route.component || route.label}
                  <IconChevronDown size={14} />
                </span>
              </button>
            }
          </Box>
        </Menu.Target>
        <Menu.Dropdown>
          {route.subItems.map((subItem: SubRouteLink) => {
            const isSubActive =
              subItem.exactMatch ?
                pathname === subItem.href
              : pathname.startsWith(subItem.href);

            return (
              <Menu.Item
                key={subItem.label}
                component={Link}
                href={subItem.href}
                leftSection={subItem.icon}
                data-active={isSubActive || undefined}
              >
                {subItem.label}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    );
  }

  // For routes without subItems, use the original implementation
  if (route.type === "function") {
    return (
      <button
        className={`${classes.link} ${route.customStyles}`}
        onClick={route.onClick}
      >
        {route.label}
      </button>
    );
  }

  const isActive =
    route.exactMatch ?
      pathname === route.href
    : pathname.startsWith(route.href);

  if (route.type === "link") {
    return (
      <a
        href={route.href}
        className={`${!route.component && classes.link} ${route.customStyles ? classes[route.customStyles] : ""}`}
        data-active={isActive || undefined}
      >
        {route.component || route.label}
      </a>
    );
  }
}
