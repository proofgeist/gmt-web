import { ContactModal } from "@/components/modals/contact/contact";
import { Container, Title, Text, Button, Card } from "@mantine/core";

export default async function Page(props: { searchParams: Promise<{ email?: string, firstName?: string, lastName?: string, company?: string }> }) {
  const searchParams = await props.searchParams;
  const email = searchParams.email;
  const firstName = searchParams.firstName;
  const lastName = searchParams.lastName;
  const company = searchParams.company;

  return (
    <Container size={420} my={40}>
      <Title ta="center">No User Found</Title>
      <Button component="a" href="/" mt={20} fullWidth>
        Go Home
      </Button>
      <Card withBorder my={20} bg="gray.0">
        <Text ta="center" >
          We couldn&apos;t find a user with the email address {email}. Trying to
          become a member? Fill out the form below to request access, or give us a
        call at <a href="tel:1-212-717-7754">1-212-717-7754</a>.
        </Text>
      </Card>
      <ContactModal email={email} firstName={firstName} lastName={lastName} company={company} />
  
    </Container>
  );
}
