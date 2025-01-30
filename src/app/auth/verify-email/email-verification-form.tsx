"use client";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { emailVerificationSchema } from "./schema";
import { verifyEmailAction } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Paper, PinInput, Text } from "@mantine/core";
import { Stack } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const hasSubmittedRef = useRef(false);
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    verifyEmailAction,
    zodResolver(emailVerificationSchema),
    {}
  );

  // Auto-fill and submit code from URL parameters
  useEffect(() => {
    const code = searchParams.get("code");
    if (code?.length === 6 && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      form.setValue("code", code);
      form.handleSubmit(() => handleSubmitWithAction())();
    }
  }, [searchParams, form, handleSubmitWithAction]);

  const onPinChange = (value: string) => {
    form.setValue("code", value);
    if (value.length === 6 && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      handleSubmitWithAction();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!hasSubmittedRef.current) {
          hasSubmittedRef.current = true;
          handleSubmitWithAction();
        }
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
          <Button
            fullWidth
            type="submit"
            loading={action.isPending}
            disabled={
              !form.getValues("code") || form.getValues("code").length !== 6
            }
          >
            Verify email
          </Button>
        </Stack>
      </Paper>
    </form>
  );
}
