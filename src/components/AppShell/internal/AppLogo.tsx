import { Group, Image } from "@mantine/core";
import React from "react";

export default function AppLogo() {
  return (
    <Group gap="0">
      <Image
        src="/gmt_banner21_white.png"
        alt="ProofKit"
        p={4}
        // maw={64}
        height={64}
        // bg="gray.1"
        radius={"md"}
        fit="contain"
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
