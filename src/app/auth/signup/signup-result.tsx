import { Container, Title, Text, Card, Group, Button, Box } from "@mantine/core";
import { ContactModal } from "@/components/modals/contact/contact";
import { openModal } from "@mantine/modals";

export function SignupStatus({
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
}) {
  return (
    <Card withBorder shadow="md" p={30} mt={30} radius="md">
      <Title ta="center">Request Sent</Title>
      <Box my={20} bg="gray.0">
        <Text ta="center">
          Your web request has been sent to Global Marine for approval. You
          will receive an email once it is approved.
        </Text>
      </Box>
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
    </Card>
  );
}
