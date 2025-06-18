import { ContactModal } from "@/components/modals/contact/contact";
import { Container, Title, Text, Button, Card, Group } from "@mantine/core";
import { openModal } from "@mantine/modals";

export default async function Page(props: {
  searchParams: Promise<{
    title?: string;
    message?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    phoneNumber?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const title = searchParams.title || "Request Sent";
  const message =
    searchParams.message ||
    "Your web request has been sent to Global Marine for approval. You will receive an email once it is approved.";
  const email = searchParams.email;
  const firstName = searchParams.firstName;
  const lastName = searchParams.lastName;
  const company = searchParams.company;
  const phoneNumber = searchParams.phoneNumber;

  return (
    <Container size={420} my={40}>
      <Title ta="center">{title}</Title>
      <Card withBorder my={20} bg="gray.0">
        <Text ta="center">{message}</Text>
      </Card>
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
    </Container>
  );
}
