import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  GridCol,
  Text,
  Title,
} from "@mantine/core";
import Services from "./services";
import HeroCarousel from "@/app/(public)/components/carousel";

export default function Home() {
  return (
    <>
      <Container mt="2rem">
        {/* Hero Section */}
        <Card bg={"gray.1"}>
          <Container>
            <Grid justify="center" align="center">
              <GridCol span={{ base: 12, sm: 6, lg: 5 }} py={"30px"} h={"100%"}>
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
              <GridCol span={{ base: 12, sm: 6, lg: 7 }} h={"100%"}>
                <HeroCarousel />
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
