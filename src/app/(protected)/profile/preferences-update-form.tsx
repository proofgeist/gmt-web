"use client";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { updatePreferencesSchema } from "./schema";
import { updatePreferencesAction } from "./actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text, Select, Stack, Button, Group } from "@mantine/core";

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
  {
   formProps: { defaultValues: { language: currentPreferences.language } },
   actionProps: {
    onSuccess: () => {
     form.reset();
    },
   },
  }
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
     <Text c="red">An error occurred</Text>
    : action.result.data?.message ?
     <Text c="green">{action.result.data.message}</Text>
    : null}

    <Group justify="end">
     <Button
      type="submit"
      loading={action.isPending}
      disabled={!form.formState.isDirty}
     >
      Update Preferences
     </Button>
    </Group>
   </Stack>
  </form>
 );
}
