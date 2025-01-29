import { Container, Text, Title } from "@mantine/core";
import { getCurrentSession } from "@/server/auth/utils/session";
import { redirect } from "next/navigation";
import MFAEnrollForm from "./mfa-enroll-form";

export default async function Page() {
  return (
    <Container size={420} my={40}>
      <Title ta="center">Set Up Two-Factor Authentication</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Enter your phone number to enable two-factor authentication.
      </Text>

      <MFAEnrollForm />
    </Container>
  );
}
