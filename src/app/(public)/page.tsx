
import {
  Anchor,
  AppShellFooter,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  GridCol,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import Services from "./services";

export default function Home() {
  return (
    <>
      <Container mt="2rem">
        {/* Hero Section */}
        <Card bg={"gray.1"}>
          <Container>
            <Grid justify="center" align="center">
              <GridCol span={{ base: 12, sm: 6 }} py={"30px"} h={"100%"}>
                <Flex
                  gap="md"
                  justify="space-between"
                  h={"100%"}
                  direction="column"
                >
                  <Title
                    order={1}
                    style={{ color: "#003366", fontWeight: 700 }}
                  >
                    Your Trusted Shipping Partner For a Connected World
                  </Title>
                  <Text size="lg" color="dimmed">
                    Superior customer service and the most competitive shipping
                    rates. At Global Marine, we believe in strong and lasting
                    relationships, superior customer service, and scheduling
                    transparency.
                  </Text>
                  <Button size="md" variant="filled">
                    Learn More
                  </Button>
                </Flex>
              </GridCol>
              <GridCol span={{ base: 12, sm: 6 }} h={"100%"}>
                <Image
                  src="/shipping-hero.jpg"
                  alt="Shipping hero image"
                  fit="cover"
                  w={"100%"}
                  h={"320px"}
                  radius={"sm"}
                />
              </GridCol>
            </Grid>
          </Container>
        </Card>

        {/* Services Section */}
        <Services />
      </Container>
    </>
  );
}
