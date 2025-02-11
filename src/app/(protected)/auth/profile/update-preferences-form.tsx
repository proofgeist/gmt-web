"use client";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { updatePreferencesSchema } from "./schema";
import { updatePreferencesAction } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text, Select, Stack, Button, Group } from "@mantine/core";

interface UpdateLanguageFormProps {
  currentLanguage: "en" | "es";
}

export default function UpdatePreferencesForm({
  currentPreferences,
}: {
  currentPreferences: {
    language: "en" | "es";
  };
}) {
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    updatePreferencesAction,
    zodResolver(updatePreferencesSchema),
    { formProps: { defaultValues: { language: currentPreferences.language } } }
  );

  return (
    <form onSubmit={handleSubmitWithAction}>
      <Stack>
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
          <Text c="red">An error occured</Text>
        : null}

        {form.formState.isDirty && (
          <Group justify="end">
            <Button type="submit" loading={action.isPending}>
              Update Email
            </Button>
          </Group>
        )}
      </Stack>
    </form>
  );
}
