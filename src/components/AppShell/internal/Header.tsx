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

export function Header({ routes, textColor = "brand" }: { routes: Route[], textColor?: string }) {
  const [scroll] = useWindowScroll();
  const [hidden, setHidden] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    if (scroll.y > lastScrollTop) {
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
      className={`${classes.header} ${hidden ? classes.headerHidden : ""} `}
      style={{
        height: headerHeight,
        border: "none",
        ...(isAtTop ?
          {}
        : {
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "none",
          }),
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
          c={textColor}
        >
          <SlotHeaderLeft />
          <Box visibleFrom="md">
            <SlotHeaderCenter />
          </Box>
          <Box visibleFrom="sm">
            <SlotHeaderRight routes={routes} />
          </Box>
          <Box hiddenFrom="sm">
            <HeaderMobileMenu routes={routes} />
          </Box>
        </Group>
      </Container>
    </header>
  );
}
