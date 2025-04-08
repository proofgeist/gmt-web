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
} from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SignupForm() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email");

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

  useEffect(() => {
    if (emailFromUrl) {
      form.setValue("email", emailFromUrl);
    }
  }, [emailFromUrl, form]);

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
            label="Company"
            placeholder="Company"
            required
            withAsterisk={false}
            {...form.register("company")}
            error={form.formState.errors.company?.message}
          />
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

          {action.result.data?.error ?
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
