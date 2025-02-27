import { Group, Image, Text, Title, Box } from "@mantine/core";
import React from "react";
import { yellowtail } from "@/config/theme/fonts";

export default function AppLogo() {
  return (
    <Group gap="xs">
      <Box
        style={{
          borderRadius: "10px",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        <Image
          src="/gmt_logo.png"
          alt="ProofKit"
          p={4}
          maw={42}
          height={42}
          // bg="gray.1"
          // radius={"lg"}
          fit="contain"
        />
      </Box>
      <Title order={2}>
        <Text span fz={24} className={yellowtail.className}>
          my
        </Text>
        GMT
      </Title>
    </Group>
  );
}
