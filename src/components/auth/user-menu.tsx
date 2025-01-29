"use client";

import { Button, Menu, px, Skeleton } from "@mantine/core";
import { useUser } from "./use-user";
import Link from "next/link";
import { IconChevronDown, IconLogout, IconUser } from "@tabler/icons-react";

export default function UserMenu() {
  const { state, user, logout } = useUser();

  if (state === "loading") {
    return <Skeleton w={100} h={20} color="brand.1" />;
  }
  if (state === "unauthenticated") {
    return (
      <Button
        component="a"
        href="/auth/login"
        variant="white"
        size="sm"
        c="brand.7"
        // bg="gray.1"
      >
        Sign in
      </Button>
    );
  }
  return (
    <Menu position="bottom-end">
      <Menu.Target>
        <Button
          variant="subtle"
          size="sm"
          color="gray.1"
          rightSection={<IconChevronDown size={px("1rem")} />}
        >
          {user.email}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          component={Link}
          href="/auth/profile"
          leftSection={<IconUser size={px("1rem")} />}
        >
          My Profile
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          leftSection={<IconLogout size={px("1rem")} />}
          onClick={logout}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export function UserMobileMenu() {
  const { state,logout } = useUser();

  if (state === "loading") {
    return <Skeleton w={100} h={20} />;
  }
  if (state === "unauthenticated") {
    return (
      <Menu.Item component="a" href="/auth/login">
        Sign in
      </Menu.Item>
    );
  }
  return (
    <>
      <Menu.Divider />
      <Menu.Item
        component={Link}
        href="/auth/profile"
        leftSection={<IconUser size={px("1rem")} />}
      >
        My Profile
      </Menu.Item>
      <Menu.Item
        leftSection={<IconLogout size={px("1rem")} />}
        onClick={logout}
      >
        Sign out
      </Menu.Item>
    </>
  );
}
