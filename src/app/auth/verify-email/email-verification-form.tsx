"use client";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { emailVerificationSchema } from "./schema";
import { verifyEmailAction } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Paper, PinInput, Text } from "@mantine/core";
import { Stack } from "@mantine/core";

export default function EmailVerificationForm() {
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
