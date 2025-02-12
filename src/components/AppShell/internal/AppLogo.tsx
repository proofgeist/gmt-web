import { Group, Image, Mark, Text, Title } from "@mantine/core";
import React from "react";
import { yellowtail } from "@/config/theme/fonts";

export default function AppLogo() {
  return (
    <Group gap="xs">
      <Image
        src="/gmt_logo.png"
        alt="ProofKit"
        p={4}
        maw={42}
        height={42}
        // bg="gray.1"
        radius={"md"}
        fit="contain"
      />
      <Title order={2} >
        <Text span fz={24} className={yellowtail.className}>my</Text>GMT
      </Title>
    </Group>
  );
}
