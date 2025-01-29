import { Container, Text, Title } from "@mantine/core";
import MFAVerificationForm from "./MFAVerification";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const phoneNumber = cookieStore.get("pending_phone_number")?.value;

  if (!phoneNumber) {
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
