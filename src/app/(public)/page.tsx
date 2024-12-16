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
      <Container mt="2rem" h={"100vh"}>
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

        {/* Footer Section */}
        <AppShellFooter>
          <Box component="section" py={"30px"} bg={"#003366"} c={"white"}>
            <Container>
              <Grid align="center">
                <GridCol span={8}>
                  <Stack gap="md">
                    <Title order={4} c="white">
                      Contact Us:
                    </Title>
                    <Flex direction={{ base: "row", sm: "column" }} gap="md">
                      <Anchor href="tel:1-212-717-7754" c="white">
                        <Group gap="xs">
                          <IconPhone size={20} />
                          <Text c="white" visibleFrom="sm">
                            Phone: 1-212-717-7754
                          </Text>
                        </Group>
                      </Anchor>
                      <Anchor
                        href="mailto:GMT-bookings@globalmarinetransportation.com"
                        c="white"
                      >
                        <Group gap="xs">
                          <IconMail size={20} />
                          <Text c="white" visibleFrom="sm">
                            GMT-bookings@globalmarinetransportation.com
                          </Text>
                        </Group>
                      </Anchor>
                    </Flex>
                  </Stack>
                </GridCol>
                <GridCol span={4}>
                  <Stack gap="md">
                    <Title order={4} c="white">
                      Follow us:
                    </Title>
                    <Flex direction={{ base: "row", sm: "column" }} gap="md">
                      <Anchor
                        href="https://www.instagram.com/globalmarinetransportation/"
                        target="_blank"
                        underline="hover"
                        c="white"
                      >
                        <Group gap="xs">
                          <IconBrandInstagram size={20} />
                          <Text visibleFrom="sm">Instagram</Text>
                        </Group>
                      </Anchor>
                      <Anchor
                        href="https://www.linkedin.com/company/global-marine-transportation-inc/?viewAsMember=true"
                        target="_blank"
                        underline="hover"
                        c="white"
                      >
                        <Group gap="xs">
                          <IconBrandLinkedin size={20} />
                          <Text visibleFrom="sm">LinkedIn</Text>
                        </Group>
                      </Anchor>
                    </Flex>
                  </Stack>
                </GridCol>
              </Grid>
            </Container>
          </Box>
        </AppShellFooter>
      </Container>
    </>
  );
}
