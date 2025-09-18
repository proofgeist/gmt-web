"use client";

import { Button, Menu, px, Skeleton, Text } from "@mantine/core";
import { useUser } from "@/hooks/use-user";
import Link from "next/link";
import {
  IconChevronDown,
  IconLogin,
  IconLogout,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";
import { yellowtail } from "@/config/theme/fonts";
import { SessionValidationResult } from "@/server/auth/utils/session";

export default function UserMenu({ isPublic, initialSession }: { isPublic: boolean, initialSession: SessionValidationResult }) {
  const { logout } = useUser();


  if (!initialSession.session) {
    return (
      <Menu
        position="bottom-end"
        trigger="hover"
        openDelay={50}
        closeDelay={200}
      >
        <Menu.Target>
          <Button
            variant="white"
            size="sm"
            miw={120}
            rightSection={<IconChevronDown size={px("1rem")} color="gray" />}
          >
            <Text span className={yellowtail.className}>
              my
            </Text>
            GMT
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            component={Link}
            href="/auth/login"
            leftSection={<IconLogin size={px("1rem")} />}
          >
            Login
          </Menu.Item>
          <Menu.Item
            component={Link}
            href="/auth/signup"
            leftSection={<IconUserPlus size={px("1rem")} />}
          >
            Register
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }
  if (isPublic) {
    return (
      <Button
        component={Link}
        href="/dashboard"
        variant="white"
        size="sm"
        miw={120}
      >
        Dashboard
      </Button>
    );
  }
  return (
    <Menu position="bottom-end" trigger="hover" openDelay={50} closeDelay={200}>
      <Menu.Target>
        <Button
          variant="subtle"
          size="sm"
          rightSection={<IconChevronDown size={px("1rem")} />}
          c="inherit"
        >
          {initialSession.user.email}
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

export function UserMobileMenu({ initialSession }: { initialSession: SessionValidationResult }) {
  const { logout } = useUser();

  if (!initialSession.session) {
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
