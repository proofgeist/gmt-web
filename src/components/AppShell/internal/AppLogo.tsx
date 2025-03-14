import { Group, Image, Text, Title } from "@mantine/core";
import React from "react";
import { yellowtail } from "@/config/theme/fonts";

export default function AppLogo() {
  return (
    <Group gap="0">
      <Image
        src="/gmt_big.png"
        alt="ProofKit"
        p={4}
        maw={64}
        height={42}
        // bg="gray.1"
        radius={"md"}
        fit="contain"
      />
      <Title order={2}>
        <Text span fz={24} className={yellowtail.className}>
          my
        </Text>
        GMT
      </Title>
    </Group>
  );
}
