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
    <Card withBorder shadow="md" p={30}  radius="md" mt={75}>
      <Title ta="center" order={2}>
        Request Sent
      </Title>
      <Box my={20} bg="gray.0" p="md">
        <Text ta="center">
          Your web request for web access has been sent. You will
          receive an email once it is approved.
        </Text>
      </Box>
      <Group grow>
        <Button component="a" href="/" fullWidth>
          MyGmt.com
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
          fullWidth
        >
          Send a Message
        </Button>
      </Group>
    </Card>
  );
}
