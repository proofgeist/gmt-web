import { getCurrentSession } from "@/server/auth/utils/session";
import { Anchor, Container, Text, Title } from "@mantine/core";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import { getRedirectCookie } from "@/server/auth/utils/redirect";

export default async function Page() {
  const { session } = await getCurrentSession();

  if (session !== null) {
    const redirectTo = await getRedirectCookie();
    return redirect(redirectTo);
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome back!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component="a" href="/auth/signup">
          Create account
        </Anchor>
      </Text>

      <LoginForm />
    </Container>
  );
}
