import { Alert, Anchor, Container, Stack, Text, Title } from "@mantine/core";
import LoginForm from "./login-form";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Container size={420} my={40}>
      <Stack>
        <Title ta="center">Welcome back!</Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor size="sm" component="a" href="/auth/signup">
            Create account
          </Anchor>
        </Text>

        <LoginForm />
        {error && (
          <Alert color="red" title="Error">
            {error}
          </Alert>
        )}
      </Stack>
    </Container>
  );
}
