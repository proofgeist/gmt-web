import { Group, Image } from "@mantine/core";
import React from "react";

export default function AppLogo() {
  return (
    <Group gap="0">
      <Image
        src="/gmt_logo-only.png"
        alt="GMT"
        p={4}
        height={42}
        radius={"md"}
        fit="contain"
      />
      <Image
        src="/gmt-text.png"
        alt="Global Marine Transportation"
        p={4}
        height={42}
        radius={"md"}
        fit="contain"
      />
      <Image
        src="/gmt_21-logo.png"
        alt="21"
        p={4}
        height={42}
        radius={"md"}
        fit="contain"
        visibleFrom="md"
      />
      {/* <Title order={2}>
        <Text span fz={24} className={yellowtail.className}>
          my
        </Text>
        GMT
      </Title> */}
    </Group>
  );
}
