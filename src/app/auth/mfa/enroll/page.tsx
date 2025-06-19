import { Container, Skeleton, Text, Title } from "@mantine/core";
import MFAEnrollForm from "./mfa-enroll-form";
import { Suspense } from "react 2";

export default async function Page() {
  return (
    <Container size={420} my={40}>
      <Title ta="center">Set Up Two-Factor Authentication</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Enter your phone number to enable two-factor authentication.
      </Text>

      <Suspense fallback={<Skeleton height={400} />}>
        <MFAEnrollForm />
      </Suspense>
    </Container>
  );
}
