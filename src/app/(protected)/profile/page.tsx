import { getCurrentSession } from "@/server/auth/utils/session";
import { Container, Paper, Stack, Title } from "@mantine/core";
import { redirect } from "next/navigation";
import { usersLayout } from "@/server/auth/db/client";
import UpdateEmailForm from "./update-email-form";
import UpdatePasswordForm from "./reset-password-form";
import UpdatePhoneForm from "./update-phone-form";
import UpdatePreferencesForm from "./update-preferences-form";
import DailyReportToggle from "./daily-report-toggle";
// import EmailVerificationForm from "./email-verification-form";

export default async function Page() {
  const { user } = await getCurrentSession();

  if (user === null) {
    return redirect("/auth/login");
  }

  // Fetch user's dailyReportOptIn status
  const userRecord = await usersLayout.findOne({
    query: { id: `==${user.id}` },
  });
  const dailyReportOptIn = Boolean(userRecord.data.fieldData?.dailyReportOptIn);

  return (
    <Container size={420} my={40}>
      <Title ta="center">Profile Details</Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Stack>
          <Title order={3}>Preferences</Title>
          <UpdatePreferencesForm
            currentPreferences={{
              language: user.preferredLanguage ?? "en",
            }}
          />
        </Stack>
      </Paper>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Stack>
          <Title order={3}>Email Preferences</Title>
          <DailyReportToggle currentOptIn={dailyReportOptIn} />
        </Stack>
      </Paper>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Stack>
          <Title order={3}>Login Details</Title>
          <UpdateEmailForm currentEmail={user.email} />
          <UpdatePhoneForm currentPhoneNumber={user.phone_number_mfa ?? null} />
          <UpdatePasswordForm />
        </Stack>
      </Paper>
    </Container>
  );
}
