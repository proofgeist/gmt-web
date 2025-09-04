import { Container, Text, Title } from "@mantine/core";
import MFAVerificationForm from "./mfa-form";
import { redirect } from "next/navigation";
import {
  getCurrentSession,
  invalidateSession,
} from "@/server/auth/utils/session";
import { getPendingPhoneNumber } from "@/server/auth/utils/user";

export default async function Page() {
  const { session, user } = await getCurrentSession();

  const phoneNumber =
    session ?
      user.phone_number_mfa
    : await getPendingPhoneNumber();

  if (!phoneNumber) {
    if (session) {
      await invalidateSession(session.id);
    }
    return redirect("/auth/login");
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center">Two-Factor Authentication</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Enter the verification code sent to your phone.
      </Text>

      <MFAVerificationForm phoneNumber={phoneNumber} />
    </Container>
  );
}
