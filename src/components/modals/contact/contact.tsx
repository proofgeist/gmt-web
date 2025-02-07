"use client";

import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "./schema";
import { contactAction } from "./actions";
import {
  TextInput,
  Button,
  Stack,
  Group,
  Textarea,
} from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

export function ContactModal() {
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    contactAction,
    zodResolver(contactSchema),
    {
      actionProps: {
        onSuccess: () => {
          form.reset();
          closeAllModals();
          notifications.show({
            title: "Message sent",
            message:
              "Your message has been sent successfully, we will get back to you as soon as possible.",
            color: "green",
          });
        },
        onError: () => {
          notifications.show({
            title: "Error",
            message: "Failed to send message",
            color: "red",
          });
        },
      },
    }
  );

  return (
    <form onSubmit={handleSubmitWithAction}>
      <Stack>
        <TextInput
          label="Company Name / Nombre de Empresa"
          placeholder="Enter company name"
          {...form.register("companyName")}
          error={form.formState.errors.companyName?.message}
        />

        <Group grow>
          <TextInput
            label="First Name / Nombre"
            placeholder="Enter first name"
            {...form.register("firstName")}
            error={form.formState.errors.firstName?.message}
          />
          <TextInput
            label="Last Name / Apellido"
            placeholder="Enter last name"
            {...form.register("lastName")}
            error={form.formState.errors.lastName?.message}
          />
        </Group>

        <Group grow>
          <TextInput
            label="Email / Correo Electrónico"
            placeholder="Enter email"
            required
            {...form.register("email")}
            error={form.formState.errors.email?.message}
          />
          <TextInput
            label="Cell / WhatsApp"
            placeholder="Enter phone number"
            {...form.register("cell")}
            error={form.formState.errors.cell?.message}
          />
        </Group>

        <Textarea
          label="Message / Mensaje"
          placeholder="Enter your message"
          minRows={4}
          {...form.register("message")}
          error={form.formState.errors.message?.message}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" onClick={() => closeAllModals()}>
            Cancel
          </Button>
          <Button type="submit" loading={action.status === "executing"}>
            Send Message
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
