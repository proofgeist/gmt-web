"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppLogo from "../AppLogo";
import { Anchor } from "@mantine/core";

/**
 * DO NOT REMOVE / RENAME THIS FILE
 *
 * You may CUSTOMIZE the content of this file, but the ProofKit CLI expects this file to exist and
 * may use it to inject content for other components.
 *
 * If you don't want it to be used, you may return null or an empty fragment
 */
export function SlotHeaderLeft() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) {
    return <div></div>;
  }

  return (
    <Anchor component={Link} href="/" underline="never" c="inherit">
      <AppLogo />
    </Anchor>
  );
}

export default SlotHeaderLeft;
