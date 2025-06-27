"use client";

import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { signupAction } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "./schema";
import {
  PasswordInput,
  TextInput,
  Button,
  Stack,
  Paper,
  Text,
  Select,
  Group,
  Divider,
} from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { AsYouType } from "libphonenumber-js";
import { SignupStatus } from "./signup-result";

export default function SignupForm({
  initialPhonePrefix,
}: {
  initialPhonePrefix?: string;
}) {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email");
  const firstNameFromUrl = searchParams.get("firstName");
  const lastNameFromUrl = searchParams.get("lastName");
  const companyFromUrl = searchParams.get("company");
  const phoneNumberFromUrl = searchParams.get("phoneNumber");

  const { form, handleSubmitWithAction, action } = useHookFormAction(
    signupAction,
    zodResolver(signupSchema),
    {
      actionProps: {
        onError: (error) => {
          console.error(error);
        },
      },
    }
  );
  const handlePhoneChange = (value: string) => {
    // Always ensure there's a + at the start
    const normalizedValue =
      value.startsWith("+") ? value : `+${value.replace(/^\+*/g, "")}`;
    const formatter = new AsYouType();
    const formattedNumber = formatter.input(normalizedValue);
    form.setValue("phoneNumber", formattedNumber);
  };

  useEffect(() => {
    if (emailFromUrl) {
      form.setValue("email", emailFromUrl);
    }
    // Prefill phone number with initialPhonePrefix if not already set
    if (initialPhonePrefix && !form.watch("phoneNumber")) {
      form.setValue("phoneNumber", initialPhonePrefix);
    }
    if (firstNameFromUrl) {
      form.setValue("firstName", firstNameFromUrl);
    }
    if (lastNameFromUrl) {
      form.setValue("lastName", lastNameFromUrl);
    }
    if (companyFromUrl) {
      form.setValue("company", companyFromUrl);
    }
    if (phoneNumberFromUrl) {
      form.setValue("phoneNumber", phoneNumberFromUrl);
    }
  }, [
    emailFromUrl,
    form,
    initialPhonePrefix,
    firstNameFromUrl,
    lastNameFromUrl,
    companyFromUrl,
    phoneNumberFromUrl,
  ]);

  // Helper type guards
  function isStatusResult(
    data: typeof action.result.data
  ): data is { status: string } {
    return !!data && typeof data === "object" && "status" in data;
  }
  function isErrorResult(
    data: typeof action.result.data
  ): data is { error: string } {
    return !!data && typeof data === "object" && "error" in data;
  }

  // Show status page if signup was successful
  if (isStatusResult(action.result.data)) {
    return (
      <SignupStatus
        email={form.watch("email")}
        firstName={form.watch("firstName")}
        lastName={form.watch("lastName")}
        company={form.watch("company")}
        phoneNumber={form.watch("phoneNumber")}
      />
    );
  }

  // Show signup form
  return (
    <form onSubmit={handleSubmitWithAction}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Stack>
          <Group wrap="nowrap">
            <TextInput
              label="First Name"
              placeholder="First Name"
              required
              withAsterisk={false}
              {...form.register("firstName")}
              error={form.formState.errors.firstName?.message}
            />
            <TextInput
              label="Last Name"
              placeholder="Last Name"
              required
              withAsterisk={false}
              {...form.register("lastName")}
              error={form.formState.errors.lastName?.message}
            />
          </Group>
          <TextInput
            label="Email"
            placeholder="you@globmar.com"
            required
            withAsterisk={false}
            {...form.register("email")}
            error={form.formState.errors.email?.message}
            disabled={!!emailFromUrl}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            autoComplete="new-password"
            required
            withAsterisk={false}
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Your password (again)"
            autoComplete="new-password"
            required
            withAsterisk={false}
            {...form.register("confirmPassword")}
            error={form.formState.errors.confirmPassword?.message}
          />
          <Divider />
          <TextInput
            label="Company"
            placeholder="Company"
            required
            withAsterisk={false}
            {...form.register("company")}
            error={form.formState.errors.company?.message}
          />
          <TextInput
            label="Phone Number"
            description="Include country code (e.g. +1 for US)"
            placeholder="+1 234 555 6789"
            required
            withAsterisk={false}
            value={form.watch("phoneNumber") ?? ""}
            onChange={(e) => handlePhoneChange(e.target.value)}
            error={form.formState.errors.phoneNumber?.message?.toString()}
          />
          <Select
            label="Preferred Language"
            data={[
              { value: "en", label: "English" },
              { value: "es", label: "Spanish" },
            ]}
            value={form.watch("language")}
            withAsterisk={false}
            error={form.formState.errors.language?.message}
            disabled={action.isPending}
            onChange={(value) => {
              form.setValue("language", value as "en" | "es", {
                shouldDirty: true,
              });
            }}
          />

          {isErrorResult(action.result.data) ?
            <Text c="red">{action.result.data.error}</Text>
          : action.hasErrored ?
            <Text c="red">{action.result.serverError}</Text>
          : null}
          <Button fullWidth type="submit" loading={action.isPending}>
            Request Access
          </Button>
        </Stack>
      </Paper>
    </form>
  );
}
