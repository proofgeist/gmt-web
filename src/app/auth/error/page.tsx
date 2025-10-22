"use client";

import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Paper,
  Group,
  Anchor,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { ContactForm } from "./contact-form";
import { useState } from "react";
import { DEFAULT_INBOX } from "@/config/email";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [showContactForm, setShowContactForm] = useState(false);

  const getErrorMessage = () => {
    if (error?.includes("ACCOUNT_NOT_CONFIGURED")) {
      return {
        title: "Account Not Configured",
        message:
          "Your account is not properly set up for web access. This usually means your company profile needs to be configured by our team before you can log in.",
      };
    }
    return {
      title: "Authentication Error",
      message:
        "There was a problem with your account. Please contact support for assistance.",
    };
  };

  const { title, message } = getErrorMessage();

  return (
    <Container size="sm" py={80}>
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Stack align="center" gap="lg">
          <IconAlertCircle size={64} color="var(--mantine-color-red-6)" />
          
          <Title order={1} ta="center">
            {title}
          </Title>
          
          <Text size="lg" ta="center" c="dimmed">
            {message}
          </Text>

          {!showContactForm ? (
            <Stack gap="md" w="100%" mt="md">
              <Text ta="center" size="sm">
                Need help? You can:
              </Text>
              
              <Group justify="center" gap="md">
                <Anchor
                  href={`mailto:${DEFAULT_INBOX}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Email Support
                </Anchor>
                <Text size="sm" c="dimmed">
                  or
                </Text>
                <Button
                  variant="light"
                  onClick={() => setShowContactForm(true)}
                >
                  Send a Message
                </Button>
              </Group>

              <Button
                component="a"
                href="/auth/login"
                variant="subtle"
                mt="md"
                fullWidth
              >
                Return to Login
              </Button>
            </Stack>
          ) : (
            <Stack w="100%" mt="md">
              <Text size="sm" fw={500} mb="xs">
                Contact Support
              </Text>
              <ContactForm />
              <Button
                variant="subtle"
                onClick={() => setShowContactForm(false)}
                mt="xs"
              >
                Cancel
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}


