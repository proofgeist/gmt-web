"use client";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { emailVerificationSchema } from "../schema";
import { verifyEmailAction } from "../actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container, Paper, Text } from "@mantine/core";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function AutoVerifyContent() {
  const searchParams = useSearchParams();
  const hasSubmitted = useRef(false);
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    verifyEmailAction,
    zodResolver(emailVerificationSchema),
    {}
  );

  useEffect(() => {
    const code = searchParams.get("code");
    if (code?.length === 6 && !hasSubmitted.current) {
      hasSubmitted.current = true;
      form.setValue("code", code);
      form.handleSubmit(() => handleSubmitWithAction())();
    }
  }, [searchParams, form, handleSubmitWithAction]);

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {action.result.data?.error ?
          <Text c="red" ta="center">
            {action.result.data.error}
          </Text>
        : action.hasErrored ?
          <Text c="red" ta="center">
            An error occurred
          </Text>
        : <Text ta="center">Verifying your email...</Text>}
      </Paper>
    </Container>
  );
}

export default function AutoVerifyPage() {
  return (
    <Suspense>
      <AutoVerifyContent />
    </Suspense>
  );
}
