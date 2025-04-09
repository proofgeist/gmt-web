import {
  Container,
  Title,
  Text,
  Card,
  Table,
  TableThead,
  TableTbody,
  TableTr,
  TableTd,
  TableTh,
  Stack,
  CardSection,
  Box,
  Center,
} from "@mantine/core";
import { IconRuler } from "@tabler/icons-react";
import styles from "../about.module.css";
import { brandColor } from "@/config/theme/mantine-theme";
import { ContactButton } from "../contact-button";

const containerData = [
  {
    type: "20FT",
    external: "6090mm x 2440mm x 2590mm",
    internal: "6010mm x 2340mm x 2390mm",
    doorOpening: "2280mm x 2310mm",
    tareWeight: "2050 kg",
    payLoad: "28430 kg",
    maxGross: "30480 kg",
  },
  {
    type: "40FT",
    external: "12180mm x 2440mm x 2590mm",
    internal: "12110mm x 2340mm x 2390mm",
    doorOpening: "2280mm x 2310mm",
    tareWeight: "3750 kg",
    payLoad: "26730 kg",
    maxGross: "30480 kg",
  },
  {
    type: "40HC",
    external: "12180mm x 2440mm x 2900mm",
    internal: "12110mm x 2340mm x 2690mm",
    doorOpening: "2280mm x 2580mm",
    tareWeight: "3890 kg",
    payLoad: "26590 kg",
    maxGross: "30480 kg",
  },
  {
    type: "45FT",
    external: "13716mm x 2440mm x 2896mm",
    internal: "13556mm x 2352mm x 2698mm",
    doorOpening: "2280mm x 2580mm",
    tareWeight: "4800 kg",
    payLoad: "27700 kg",
    maxGross: "32500 kg",
  },
];

export default function ContainerSizes() {
  return (
    <Container size="lg" py="xl">
      <Card shadow="md" radius="md" padding="xl" withBorder>
        <CardSection>
          <div style={{ position: "relative" }}>
            <div
              style={{
                height: "400px",
                backgroundImage: 'url("/cargo-image-1.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <Center>
                  <div className={styles.serviceIcon}>
                    <IconRuler size={60} stroke={1.5} color={brandColor[8]} />
                  </div>
                </Center>
                <Title ta="center" c="white" size="h1" mb="sm">
                  Standard Container Sizes
                </Title>
                <Text ta="center" c="white" size="xl" maw={800} mx="auto">
                  Comprehensive guide to shipping container dimensions and
                  specifications
                </Text>
              </div>
            </div>
          </div>
        </CardSection>

        <Stack gap="xl" mt="xl">
          <Text size="lg" lh={1.7}>
            Shipping containers and storage containers can come in a range of
            sizes, with 20ft and 40ft being the most common lengths (externally)
            and 8ft in width as standard. The height of a container is typically
            8ft 6&quot; and a high cube will have an additional foot to be 9ft
            6&quot;.
          </Text>

          <Title order={2} size="h2">
            Container Specifications
          </Title>

          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <TableThead>
              <TableTr>
                <TableTh>Container Type</TableTh>
                <TableTh>External (L x W x H)</TableTh>
                <TableTh>Internal (L x W x H)</TableTh>
                <TableTh>Door Opening (W x H)</TableTh>
                <TableTh>Tare Weight</TableTh>
                <TableTh>Pay Load</TableTh>
                <TableTh>Max Gross Weight</TableTh>
              </TableTr>
            </TableThead>
            <TableTbody>
              {containerData.map((container) => (
                <TableTr key={container.type}>
                  <TableTd fw={500}>{container.type}</TableTd>
                  <TableTd>{container.external}</TableTd>
                  <TableTd>{container.internal}</TableTd>
                  <TableTd>{container.doorOpening}</TableTd>
                  <TableTd>{container.tareWeight}</TableTd>
                  <TableTd>{container.payLoad}</TableTd>
                  <TableTd>{container.maxGross}</TableTd>
                </TableTr>
              ))}
            </TableTbody>
          </Table>

          <Box mt="xl">
            <Title order={3} size="h3" mb="md">
              Understanding Container Weights
            </Title>
            <Stack gap="md">
              <Text>
                <strong>Tare Weight:</strong> The weight of the empty container
                without cargo or contents.
              </Text>
              <Text>
                <strong>Pay Load (Net Weight):</strong> The maximum weight of
                cargo that can be loaded into the container.
              </Text>
              <Text>
                <strong>Max Gross Weight:</strong> The maximum total weight of
                the container including both the container weight and its
                contents.
              </Text>
            </Stack>
          </Box>

          <CardSection mt="xl" inheritPadding py="xl">
            <Box
              style={{
                backgroundColor: "#f8f9fa",
                padding: "2rem",
                borderRadius: "8px",
                position: "relative",
                overflow: "hidden",
                minHeight: "500px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: 'url("/customer-service-image-7.jpg")',
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                  opacity: 0.25,
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "400px",
                }}
              >
                <Title order={2} size="h2" mb="md" ta="center">
                  Ready to Ship with Us?
                </Title>
                <Text size="lg" maw={700} mx="auto" mb="xl" ta="center">
                  Contact our team today to discuss your shipping needs and
                  discover how Global Marine Transportation can optimize your
                  logistics operations.
                </Text>
                <ContactButton />
              </div>
            </Box>
          </CardSection>
        </Stack>
      </Card>
    </Container>
  );
}
