"use client";

import { Card, Stack, Text, Group, Box, useMantineTheme } from "@mantine/core";
import { IconFileDescription } from "@tabler/icons-react";
import { useState } from "react";

// Define styles for the quotes card hover effect
const quoteCardStyles = {
  container: {
    position: "relative" as const,
    overflow: "hidden" as const,
    flexGrow: 1,
  },
  overlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    background: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(3px)",
    transition: "opacity 0.3s ease",
    borderRadius: "8px",
    opacity: 0,
    zIndex: 10,
  },
};

export default function QuotesCard() {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useMantineTheme();

  return (
    <Card
      withBorder
      padding="lg"
      radius="md"
      shadow="sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box
        style={{
          ...quoteCardStyles.overlay,
          opacity: isHovered ? 1 : 0,
          pointerEvents: isHovered ? "auto" : "none",
        }}
      >
        <Text fz="xl" fw={600} c="white">
          Coming Soon
        </Text>
      </Box>

      <Stack align="center" justify="center" gap="xs">
        <Group align="center" maw={125} w={"100%"} justify="center">
          <IconFileDescription
            size={40}
            color={theme.colors.brand[9]}
            stroke={1.5}
          />
          <Text fz={32} fw={700}>
            0
          </Text>
        </Group>
        <Text fz="lg" c="dimmed">
          My Quotes
        </Text>
      </Stack>
    </Card>
  );
}
