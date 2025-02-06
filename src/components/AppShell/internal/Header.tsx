"use client";
import { Box, Container, Group } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import SlotHeaderCenter from "../slot-header-center";
import SlotHeaderLeft from "../slot-header-left";
import SlotHeaderRight from "../slot-header-right";
import { headerHeight } from "./config";
import classes from "./Header.module.css";
import HeaderMobileMenu from "./HeaderMobileMenu";

export function Header() {
  const [scroll] = useWindowScroll();
  const [hidden, setHidden] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (scroll.y > lastScrollTop) {
      // scrolling down
      setHidden(true);
    } else {
      // scrolling up
      setHidden(false);
    }
    setLastScrollTop(scroll.y);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scroll.y]);

  return (
    <header
      className={`${classes.header} ${hidden ? classes.headerHidden : ""} ${
        isHomePage ? classes.homeHeader : ""
      }`}
      style={{
        height: headerHeight,
        border: "none",
      }}
    >
      <Container size="xl" className={classes.inner} style={{ height: "100%" }}>
        <Group
          justify="space-between"
          align="center"
          w="100%"
          style={{
            height: "100%",
          }}
          c={isHomePage ? "white" : "brand"}
        >
          <SlotHeaderLeft />
          <Box visibleFrom="md">
            <SlotHeaderCenter />
          </Box>
          <Box visibleFrom="sm">
            <SlotHeaderRight />
          </Box>
          <Box hiddenFrom="sm">
            <HeaderMobileMenu />
          </Box>
        </Group>
      </Container>
    </header>
  );
}
