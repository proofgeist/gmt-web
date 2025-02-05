import { Box, Container, Group } from "@mantine/core";

import SlotHeaderCenter from "../slot-header-center";
import SlotHeaderLeft from "../slot-header-left";
import SlotHeaderRight from "../slot-header-right";
import { headerHeight } from "./config";
import classes from "./Header.module.css";
import HeaderMobileMenu from "./HeaderMobileMenu";

export function Header() {
  return (
    <header
      className={classes.header}
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
          style={{ height: "100%" }}
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
