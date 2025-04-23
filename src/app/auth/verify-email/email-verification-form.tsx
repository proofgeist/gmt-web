"use client";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { emailVerificationSchema } from "./schema";
import { resendEmailVerificationAction, verifyEmailAction } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Paper, PinInput, Text } from "@mantine/core";
import { Stack } from "@mantine/core";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

export default function EmailVerificationForm({ cookie }: { cookie?: string }) {
  const resendAction = useAction(resendEmailVerificationAction);
  const [hasCookie, setHasCookie] = useState<boolean>(!!cookie);
  useEffect(() => {
    if (!hasCookie) {
      resendAction.execute();
      setHasCookie(true);
    }
  }, [hasCookie, resendAction]);

  const { form, handleSubmitWithAction, action } = useHookFormAction(
    verifyEmailAction,
    zodResolver(emailVerificationSchema),
    {}
  );

  const onPinChange = (value: string) => {
    form.setValue("code", value);
    if (value.length === 6) {
      handleSubmitWithAction();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmitWithAction();
      }}
    >
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Stack align="center">
          <PinInput
            length={6}
            autoFocus
            oneTimeCode
            {...form.register("code")}
            onChange={onPinChange}
          />

          {action.result.data?.error ?
            <Text c="red">{action.result.data.error}</Text>
          : action.hasErrored ?
            <Text c="red">An error occurred</Text>
          : null}
          <Group>
            <Button variant="subtle" component={"a"} href="/dashboard">
              Verify later
            </Button>
            <Button
              type="submit"
              loading={action.isPending}
              disabled={
                !form.getValues("code") || form.getValues("code").length !== 6
              }
            >
              Verify email
            </Button>
          </Group>
        </Stack>
      </Paper>
    </form>
  );
}
