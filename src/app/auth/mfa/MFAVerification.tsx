"use client";

import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { verifyMFAAction } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Paper, PinInput, Stack, Text } from "@mantine/core";
import { sendVerificationCodeAction } from "./actions";

const verifyMFASchema = z.object({
  code: z.string().length(6),
});

export default function MFAVerificationForm({
  phoneNumber,
}: {
  phoneNumber: string;
}) {
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    verifyMFAAction,
    zodResolver(verifyMFASchema),
    {}
  );

  const handleResendCode = async () => {
    try {
      await sendVerificationCodeAction({ phoneNumber });
    } catch (error) {
      console.error("Error resending code:", error);
    }
  };

  return (
    <form onSubmit={handleSubmitWithAction}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Stack>
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

          <Button
            variant="subtle"
            onClick={handleResendCode}
            loading={action.isPending}
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
