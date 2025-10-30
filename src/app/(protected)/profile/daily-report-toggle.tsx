"use client";
import React, { useEffect } from "react";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { toggleDailyReportOptInAction } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text, Switch, Stack, Group } from "@mantine/core";
import { z } from "zod";
import { notifications } from "@mantine/notifications";

const dailyReportSchema = z.object({
  optIn: z.boolean(),
});

interface DailyReportToggleProps {
  currentOptIn: boolean;
}

export default function DailyReportToggle({
  currentOptIn,
}: DailyReportToggleProps) {
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    toggleDailyReportOptInAction,
    zodResolver(dailyReportSchema),
    {
      formProps: { defaultValues: { optIn: currentOptIn } },
      actionProps: {
        onSuccess: (result) => {
          if (result.data?.message) {
            notifications.show({
              title: "Success",
              message: result.data.message,
              color: "green",
            });
          }
        },
        onError: () => {
          notifications.show({
            title: "Error",
            message: "Failed to update email preferences",
            color: "red",
          });
        },
      },
    }
  );

  // Update form when currentOptIn changes (e.g., after successful update)
  useEffect(() => {
    form.setValue("optIn", currentOptIn);
  }, [currentOptIn, form]);

  const handleToggle = async (checked: boolean) => {
    form.setValue("optIn", checked, { shouldDirty: true });
    // Trigger form submission programmatically using a synthetic event
    const syntheticEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
    } as React.FormEvent<HTMLFormElement>;
    await handleSubmitWithAction(syntheticEvent);
  };

  return (
    <form onSubmit={handleSubmitWithAction}>
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          <div style={{ flex: 1 }}>
            <Text fw={500} size="sm">
              Daily Booking Reports
            </Text>
            <Text size="xs" c="dimmed">
              Receive a daily email with your active bookings and their current
              status
            </Text>
          </div>
          <Switch
            checked={form.watch("optIn")}
            onChange={(event) => handleToggle(event.currentTarget.checked)}
            disabled={action.isPending}
            size="md"
          />
        </Group>

        {action.result.data?.error ? (
          <Text c="red" size="sm">
            {action.result.data.error}
          </Text>
        ) : null}
      </Stack>
    </form>
  );
}

