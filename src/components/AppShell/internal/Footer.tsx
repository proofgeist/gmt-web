import {
  Box,
  Container,
  Grid,
  GridCol,
  Stack,
  Anchor,
  Group,
  Text,
  Title,
  Flex,
} from "@mantine/core";
import {
  IconBrandInstagram,
  IconMail,
  IconPhone,
  IconBrandLinkedin,
} from "@tabler/icons-react";

export function Footer() {
  return (
    <Box
      component="section"
      p={"3rem 0 4rem 0"}
      bg={"black"}
      c={"white"}
      w="100%"
    >
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
  );
}

export default Footer;
