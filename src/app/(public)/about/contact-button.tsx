"use client";

import { Button } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { ContactModal } from "@/components/modals/contact/contact";

export function ContactButton() {
  return (
    <Button
      size="lg"
      variant="gradient"
      gradient={{ from: "blue", to: "brand" }}
      onClick={() =>
        openModal({
          id: "contact",
          title: "Contact Us",
          children: <ContactModal />,
        })
      }
    >
      Contact Us
    </Button>
  );
}
