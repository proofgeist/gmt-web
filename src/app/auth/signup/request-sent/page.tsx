import { getCurrentSession } from "@/server/auth/utils/session";
import { Container, Text, Title } from "@mantine/core";
import { redirect } from "next/navigation";
import { getRedirectCookie } from "@/server/auth/utils/redirect";
import { Button } from "@mantine/core";

export default async function Page() {
  const { session } = await getCurrentSession();

  if (session !== null) {
    const redirectTo = await getRedirectCookie();
    return redirect(redirectTo);
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center">Request sent</Title>
      <Text ta="center" mt={20}>
        Your web request has been sent to Global Marine for approval. You will receive an email once it is approved.
      </Text>
      <Button component="a" href="/" mt={20} fullWidth>
        Go Home
      </Button>
    </Container>
  );
}
