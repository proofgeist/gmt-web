"use client";

import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { verifyMFAAction } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Checkbox, Paper, PinInput, Stack, Text } from "@mantine/core";
import { sendVerificationCodeAction } from "./actions";
import { useEffect, useState } from "react";

const verifyMFASchema = z.object({
  code: z.string().length(6),
  rememberDevice: z.boolean().default(false),
});

export default function MFAVerificationForm({
  phoneNumber,
}: {
  phoneNumber: string;
}) {
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    verifyMFAAction,
    zodResolver(verifyMFASchema)
  );
  const [isResending, setIsResending] = useState(false);

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      await sendVerificationCodeAction({ phoneNumber });
    } catch (error) {
      console.error("Error resending code:", error);
    } finally {
      setIsResending(false);
    }
  };

  const handleError = () => {
    form.setValue("code", "");
  };

  useEffect(() => {
    if (action.hasErrored || action.result.data?.error) {
      form.setValue("code", "");
    }
  }, [action.hasErrored, action.result.data?.error, form]);

  return (
    <form onSubmit={handleSubmitWithAction} onError={handleError}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Stack align="center">
          <PinInput
            length={6}
            autoFocus
            oneTimeCode
            {...form.register("code")}
            onChange={(value) => {
              form.setValue("code", value);
              if (value.length === 6) {
                handleSubmitWithAction();
              }
            }}
          />

          {action.result.data?.error ?
            <Text c="red">{action.result.data.error}</Text>
          : action.hasErrored ?
            <Text c="red">An error occurred</Text>
          : null}

          <Checkbox
            label="Remember this device for 30 days"
            {...form.register("rememberDevice")}
          />
          <Button
            variant="subtle"
            onClick={handleResendCode}
            loading={isResending}
          >
            Resend Code
          </Button>

          <Button fullWidth type="submit" loading={action.isPending}>
            Verify
          </Button>
        </Stack>
      </Paper>
    </form>
  );
}
