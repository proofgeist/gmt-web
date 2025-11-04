"use client";

import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Paper,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging (won't be visible to users)
    console.error("Protected route error:", error);
  }, [error]);

  return (
    <Container size="sm" py={80}>
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Stack align="center" gap="lg">
          <IconAlertCircle size={64} color="var(--mantine-color-red-6)" />
          
          <Title order={1} ta="center">
            Something went wrong
          </Title>
          
          <Text size="lg" ta="center" c="dimmed">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </Text>

          <Button onClick={reset} mt="md">
            Try again
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

