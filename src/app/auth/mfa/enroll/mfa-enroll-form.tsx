"use client";

import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Paper, Stack, Text, TextInput } from "@mantine/core";
import { mfaEnrollSchema } from "./schema";
import { mfaEnrollAction } from "./actions";

export default function MFAEnrollForm() {
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    mfaEnrollAction,
    zodResolver(mfaEnrollSchema),
    {}
  );

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
            error={form.formState.errors.phoneNumber?.message}
          />

          {action.result.data?.error ?
            <Text c="red">{action.result.data.error}</Text>
          : action.hasErrored ?
            <Text c="red">An error occurred</Text>
          : null}

          <Button fullWidth type="submit" loading={action.isPending}>
            Continue
          </Button>
        </Stack>
      </Paper>
    </form>
  );
}
