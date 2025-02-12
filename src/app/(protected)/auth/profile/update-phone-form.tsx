"use client";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { updatePhoneNumberSchema } from "./schema";
import { updatePhoneNumberAction } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Text, Stack, PinInput } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { useEffect } from "react";
import { AsYouType } from "libphonenumber-js";

export default function UpdatePhoneForm({
  currentPhoneNumber,
}: {
  currentPhoneNumber: string | null;
}) {
  const formattedPhoneNumber = () => {
    if (currentPhoneNumber) {
      const formatter = new AsYouType();
      const formattedNumber = formatter.input(currentPhoneNumber);
      return formattedNumber;
    }
    return "";
  };
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    updatePhoneNumberAction,
    zodResolver(updatePhoneNumberSchema),
    {
      formProps: {
        defaultValues: { phoneNumber: formattedPhoneNumber() || "" },
      },
      actionProps: {
        onSuccess: () => {
          form.reset();
        },
      },
    }
  );

  useEffect(() => {
    if (action.hasErrored || action.result.data?.error) {
      form.setValue("code", "");
    }
  }, [action.hasErrored, action.result.data?.error, form]);

  const handlePhoneChange = (value: string) => {
    // Always ensure there's a + at the start
    const normalizedValue =
      value.startsWith("+") ? value : `+${value.replace(/^\+*/g, "")}`;
    const formatter = new AsYouType();
    const formattedNumber = formatter.input(normalizedValue);
    form.setValue("phoneNumber", formattedNumber, { shouldDirty: true });
  };
  return (
    <form onSubmit={handleSubmitWithAction}>
      <Stack>
        <TextInput
          label="Phone Number"
          required
          withAsterisk={false}
          {...form.register("phoneNumber")}
          error={form.formState.errors.phoneNumber?.message}
          onChange={(e) => handlePhoneChange(e.target.value)}
        />

        {action.result.data?.codeSent && (
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
            />
          </Stack>
        )}

        {action.result.data?.error ?
          <Text c="red">{action.result.data.error}</Text>
        : action.hasErrored ?
          <Text c="red">An error occurred</Text>
        : action.result.data?.message ?
          <Text c="green">{action.result.data.message}</Text>
        : null}

        {(form.formState.isDirty || action.result.data?.codeSent) && (
          <Group justify="end">
            <Button type="submit" loading={action.isPending}>
              {action.result.data?.codeSent ? "Verify Code" : "Update Phone"}
            </Button>
          </Group>
        )}
      </Stack>
    </form>
  );
}
