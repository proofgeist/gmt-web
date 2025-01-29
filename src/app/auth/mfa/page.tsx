import { Container, Text, Title } from "@mantine/core";
import MFAVerificationForm from "./MFAVerification";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getCurrentSession,
  invalidateSession,
} from "@/server/auth/utils/session";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  const cookieStore = await cookies();
  const phoneNumber =
    session ?
      user.phone_number_mfa
    : cookieStore.get("pending_phone_number")?.value;

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
