"use client";

import { Button, Container, Paper, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAction } from "next-safe-action/hooks";
import { testDailyReportAction } from "./actions";

export default function AdminPage() {
  const { execute, isPending, result } = useAction(testDailyReportAction, {
    onSuccess: (result) => {
      if (result.data?.success) {
        notifications.show({
          title: "Success",
          message: result.data.message || "Daily reports sent successfully",
          color: "green",
        });
      } else {
        notifications.show({
          title: "Error",
          message: result.data?.error || "Failed to send daily reports",
          color: "red",
        });
      }
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.error?.serverError || "An unexpected error occurred",
        color: "red",
      });
    },
  });

  const handleTest = () => {
    execute({});
  };

  return (
    <Container size="sm" my={40}>
      <Title ta="center" mb="xl">
        Admin Dashboard
      </Title>

      <Paper withBorder shadow="md" p={30} radius="md">
        <Stack>
          <Title order={3}>Daily Booking Reports</Title>
          <Text size="sm" c="dimmed">
            Click the button below to test sending daily booking reports to all
            opted-in users.
          </Text>

          <Button
            onClick={handleTest}
            loading={isPending}
            fullWidth
            size="lg"
            mt="md"
          >
            Send Test Daily Reports
          </Button>

          {result?.data && (
            <Paper p="md" mt="md" withBorder>
              <Stack gap="xs">
                {result.data.error ? (
                  <Text c="red" fw={500}>
                    Error: {result.data.error}
                  </Text>
                ) : (
                  <>
                    <Text fw={500}>Result:</Text>
                    <Text size="sm">{result.data.message}</Text>
                    <Text size="sm">
                      Users processed: {result.data.usersProcessed || 0}
                    </Text>
                    <Text size="sm" c="green">
                      Emails sent: {result.data.emailsSent || 0}
                    </Text>
                    {result.data.errors !== undefined && result.data.errors > 0 && (
                      <Text size="sm" c="red">
                        Errors: {result.data.errors}
                      </Text>
                    )}
                  </>
                )}
              </Stack>
            </Paper>
          )}

          <Text size="xs" c="dimmed" mt="md">
            Note: This will send emails to all users who have opted in to daily
            reports. Make sure to test with a small number of users first.
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}

