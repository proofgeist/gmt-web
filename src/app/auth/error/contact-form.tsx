"use client";

import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/components/modals/contact/schema";
import { contactAction } from "@/components/modals/contact/actions";
import {
  TextInput,
  Button,
  Stack,
  Group,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { DEFAULT_INBOX } from "@/config/email";

export function ContactForm() {
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    contactAction,
    zodResolver(contactSchema),
    {
      actionProps: {
        onSuccess: () => {
          form.reset();
          notifications.show({
            title: "Message sent",
            message:
              "Your message has been sent successfully. Our support team will get back to you as soon as possible.",
            color: "green",
          });
        },
        onError: () => {
          notifications.show({
            title: "Error",
            message: `Failed to send message. Please try emailing ${DEFAULT_INBOX} directly.`,
            color: "red",
          });
        },
      },
      formProps: {
        defaultValues: {
          email: "",
          firstName: "",
          lastName: "",
          companyName: "",
          cell: "",
          message: "I'm having trouble accessing my account. My company profile may not be configured for web access.",
        },
      },
    }
  );

  return (
    <form onSubmit={handleSubmitWithAction}>
      <Stack gap="md">
        <TextInput
          label="Company Name"
          placeholder="Enter company name"
          {...form.register("companyName")}
          error={form.formState.errors.companyName?.message}
        />

        <Group grow>
          <TextInput
            label="First Name"
            placeholder="Enter first name"
            {...form.register("firstName")}
            error={form.formState.errors.firstName?.message}
          />
          <TextInput
            label="Last Name"
            placeholder="Enter last name"
            {...form.register("lastName")}
            error={form.formState.errors.lastName?.message}
          />
        </Group>

        <Group grow>
          <TextInput
            label="Email"
            placeholder="Enter email"
            required
            {...form.register("email")}
            error={form.formState.errors.email?.message}
          />
          <TextInput
            label="Cell/WhatsApp"
            placeholder="Enter phone number"
            {...form.register("cell")}
            error={form.formState.errors.cell?.message}
          />
        </Group>

        <Textarea
          label="Message"
          placeholder="Enter your message"
          minRows={4}
          {...form.register("message")}
          error={form.formState.errors.message?.message}
        />

        <Button type="submit" loading={action.status === "executing"} fullWidth>
          Send Message
        </Button>
      </Stack>
    </form>
  );
}


