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
  Divider,
  Group,
} from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CountryCode, getCountryCallingCode } from "libphonenumber-js";
import { SignupStatus } from "./signup-result";
import { useUser } from "@/components/auth/use-user";
import { redirectAction } from "@/server/auth/utils/redirect-action";
import { PhoneNumberInput } from "@/components/ui/PhoneNumberInput";

export default function SignupForm({ userCountryCode }: { userCountryCode?: CountryCode }) {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email");
  const firstNameFromUrl = searchParams.get("firstName");
  const lastNameFromUrl = searchParams.get("lastName");
  const companyFromUrl = searchParams.get("company");
  const phoneNumberFromUrl = searchParams.get("phoneNumber");

  const { session } = useUser();
  if (session) {
    redirectAction();
  }

  const { form, handleSubmitWithAction, action } = useHookFormAction(
    signupAction,
    zodResolver(signupSchema),
    {
      actionProps: {
        onError: (error) => {
          console.error(error);
        },
      },
      formProps: {
        defaultValues: {
          language: "en",
        },
      },
    }
  );

  useEffect(() => {
    if (emailFromUrl) {
      form.setValue("email", emailFromUrl);
    }
    // Prefill phone number with the selected country code if not already set
    if (!form.watch("phoneNumber") && userCountryCode) {
      const countryCode = getCountryCallingCode(userCountryCode);
      form.setValue("phoneNumber", `+${countryCode}`);
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
    userCountryCode,
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
  console.log(action.result.data);
  if (isStatusResult(action.result.data)) {
    console.log("signup successful");
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
      <Paper withBorder shadow="md" p={30} mt={30} radius="md" >
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
            disabled={!!companyFromUrl}
          />
          <PhoneNumberInput
            value={form.watch("phoneNumber") ?? ""}
            onChange={(value) => form.setValue("phoneNumber", value)}
            error={form.formState.errors.phoneNumber?.message?.toString()}
            defaultCountry={userCountryCode}
            required
          />
          <Select
            label="Preferred Language"
            data={[
              { value: "en", label: "English" },
              { value: "es", label: "Spanish" },
            ]}
            searchable
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
            {emailFromUrl ? "Activate Account" : "Request Access"}
          </Button>
        </Stack>
      </Paper>
    </form>
  );
}
