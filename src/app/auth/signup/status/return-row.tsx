"use client";

import { ContactModal } from "@/components/modals/contact/contact";
import { Button, Group } from "@mantine/core";
import { openModal } from "@mantine/modals";

export const ReturnRow = ({
  email,
  firstName,
  lastName,
  company,
  phoneNumber,
}: {
  email?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phoneNumber?: string;
}) => {
  return (
    <Group grow>
      <Button component="a" href="/" mt={20} fullWidth>
        Go Home
      </Button>
      <Button
        onClick={() =>
          openModal({
            id: "contact",
            title: "Contact Us",
            children: (
              <ContactModal
                email={email}
                firstName={firstName}
                lastName={lastName}
                company={company}
                cell={phoneNumber}
              />
            ),
          })
        }
        mt={20}
        fullWidth
      >
        Send a Message
      </Button>
    </Group>
  );
};
