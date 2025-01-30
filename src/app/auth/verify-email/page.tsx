import { getCurrentSession } from "@/server/auth/utils/session";
import { Anchor, Container, Text, Title } from "@mantine/core";
import { redirect } from "next/navigation";
import EmailVerificationForm from "./email-verification-form";
import ResendButton from "./resend-button";
import { getUserEmailVerificationRequestFromRequest } from "@/server/auth/utils/email-verification";
import { DEFAULT_REDIRECT_URL } from "@/config/constant";

export default async function Page(
  props: {
    searchParams: Promise<{ code?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const { user } = await getCurrentSession();

  if (user === null) {
    return redirect("/auth/login");
  }

  const code = await searchParams?.code;
  // If there's a code in the URL, redirect to the auto-verify page
  if (code?.length === 6) {
    return redirect(`/auth/verify-email/auto-verify?code=${code}`);
  }

  const verificationRequest =
    await getUserEmailVerificationRequestFromRequest();
  if (verificationRequest === null && user.emailVerified) {
    return redirect(DEFAULT_REDIRECT_URL);
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center">Verify your email</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Enter the code sent to {verificationRequest?.email ?? user.email}
      </Text>
      <Text c="dimmed" size="sm" ta="center">
        <Anchor href="/auth/profile">Change email</Anchor>
      </Text>

      <EmailVerificationForm />
      <ResendButton />
    </Container>
  );
}
