"use client";
import { Box, Container, Group } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { useEffect, useState } from "react";

import SlotHeaderCenter from "../slot-header-center";
import SlotHeaderLeft from "../slot-header-left";
import SlotHeaderRight from "../slot-header-right";
import { headerHeight } from "./config";
import classes from "./Header.module.css";
import HeaderMobileMenu from "./HeaderMobileMenu";
import { Route } from "@/app/navigation";

export function Header({
  routes,
  textColor = "brand",
  hideUserMenu = false,
  headerColor = "transparent",
}: {
  routes: Route[];
  textColor?: string;
  hideLogo?: boolean;
  hideUserMenu?: boolean;
  headerColor?: string;
}) {
  const [scroll] = useWindowScroll();
  const [hidden, setHidden] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [_isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    if (scroll.y > lastScrollTop && scroll.y > headerHeight * 0.75) {
      // scrolling down
      setHidden(true);
    } else {
      // scrolling up
      setHidden(false);
    }
    setIsAtTop(scroll.y <= 20);
    setLastScrollTop(scroll.y);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scroll.y]);

  return (
    <header
      className={`${classes.header} ${hidden ? classes.headerHidden : ""} ${classes.glassyHeader}`}
      style={{
        height: headerHeight,
        border: "none",
        backgroundColor: headerColor,
      }}
    >
      <Container fluid className={classes.inner} style={{ height: "100%" }}>
        <Group
          justify="space-between"
          align="center"
          w="100%"
          style={{
            height: "100%",
          }}
          c={textColor}
        >
          <SlotHeaderLeft />

          <Box visibleFrom="sm">
            <SlotHeaderRight routes={routes} hideUserMenu={hideUserMenu} />
          </Box>
          <Box hiddenFrom="sm">
            <HeaderMobileMenu routes={routes} burgerColor={textColor} />
          </Box>
        </Group>
      </Container>
    </header>
  );
}
