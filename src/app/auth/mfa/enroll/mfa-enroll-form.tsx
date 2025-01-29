"use client";

import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Paper, Stack, Text, TextInput, PinInput } from "@mantine/core";
import { mfaEnrollSchema } from "./schema";
import { mfaEnrollAction } from "./actions";
import { useState, useEffect } from "react";
import { z } from "zod";

type FormSchema = z.infer<typeof mfaEnrollSchema>;

export default function MFAEnrollForm() {
  const [codeSent, setCodeSent] = useState(false);
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    mfaEnrollAction,
    zodResolver(mfaEnrollSchema),
    { formProps: {} }
  );

  useEffect(() => {
    if (action.result?.data && "codeSent" in action.result.data) {
      setCodeSent(true);
    }
  }, [action.result]);

  return (
    <form onSubmit={handleSubmitWithAction}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Stack>
          <TextInput
            label="Phone Number"
            placeholder="+1 (234) 555-6789"
            required
            withAsterisk={false}
            {...form.register("phoneNumber")}
            error={form.formState.errors.phoneNumber?.message?.toString()}
            disabled={codeSent}
          />

          {codeSent && (
            <Stack align="center">
              <Text size="sm">
                Enter the verification code sent to your phone
              </Text>
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
                error={!!form.formState.errors.code}
              />
            </Stack>
          )}

          {(
            action.result &&
            typeof action.result === "object" &&
            "error" in action.result
          ) ?
            <Text c="red">{String(action.result.error)}</Text>
          : action.hasErrored ?
            <Text c="red">An error occurred</Text>
          : null}

          <Button fullWidth type="submit" loading={action.isPending}>
            {codeSent ? "Verify Code" : "Send Code"}
          </Button>
        </Stack>
      </Paper>
    </form>
  );
}
