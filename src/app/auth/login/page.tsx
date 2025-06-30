import { Anchor, Container, Text, Title } from "@mantine/core";
import LoginForm from "./login-form";

export default async function Page() {

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
