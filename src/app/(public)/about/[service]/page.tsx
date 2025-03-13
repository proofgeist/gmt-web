import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Image,
  Box,
  Stack,
  Center,
  CardSection,
} from "@mantine/core";
import styles from "../about.module.css";
import { notFound } from "next/navigation";
import {
  IconShip,
  IconGlobe,
  IconTruck,
  IconWorld,
  IconPackage,
  IconAnchor,
  IconRoute,
  IconClock,
  IconChartBar,
  IconUsers,
  IconShield,
  IconTruckDelivery,
  IconMap,
  IconHeadset,
  IconBuildingWarehouse,
} from "@tabler/icons-react";
import { ContactButton } from "../contact-button";
import { brandColor } from "@/config/theme/mantine-theme";

// Define the service data
const servicesData = {
  "ocean-freight": {
    title: "Ocean Freight",
    subtitle:
      "Maritime shipping solutions with competitive rates and flexible scheduling across major global routes.",
    icon: IconShip,
    description: [
      "Our Ocean Freight service offers comprehensive maritime shipping solutions designed to meet the diverse needs of businesses worldwide. With decades of experience in international shipping, we provide reliable and cost-effective ocean transportation services that connect you to global markets.",
      "We handle all types of cargo, from standard containers to oversized equipment, hazardous materials, and temperature-controlled goods. Our extensive network of shipping partners ensures optimal routing and competitive rates for your shipments.",
    ],
    features: [
      {
        title: "FCL & LCL Services",
        description:
          "Full container load and less than container load options to suit your shipping volume.",
        icon: IconAnchor,
      },
      {
        title: "Strategic Port Coverage",
        description:
          "Access to all major ports worldwide with efficient transshipment options.",
        icon: IconRoute,
      },
      {
        title: "Flexible Scheduling",
        description:
          "Regular departures and flexible scheduling to meet your timeline requirements.",
        icon: IconClock,
      },
    ],
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  "global-network": {
    title: "Global Network",
    subtitle:
      "Extensive network of partners worldwide ensuring seamless logistics operations.",
    icon: IconGlobe,
    description: [
      "Our Global Network is the backbone of our logistics services, connecting continents, countries, and communities through a carefully cultivated network of trusted partners and strategic locations. This extensive infrastructure allows us to provide seamless end-to-end logistics solutions regardless of origin or destination.",
      "With offices, warehouses, and partner facilities strategically positioned across key trade routes and economic centers, we ensure your cargo moves efficiently through the global supply chain with minimal delays and maximum visibility.",
    ],
    features: [
      {
        title: "Strategic Partnerships",
        description:
          "Alliances with leading carriers and logistics providers worldwide.",
        icon: IconUsers,
      },
      {
        title: "Global Compliance",
        description:
          "Expert knowledge of international trade regulations and customs requirements.",
        icon: IconShield,
      },
      {
        title: "Integrated Systems",
        description:
          "Seamless communication and data sharing across our global network.",
        icon: IconChartBar,
      },
    ],
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  "land-transport": {
    title: "Land Transport",
    subtitle:
      "Comprehensive inland transportation with door-to-door delivery and real-time tracking.",
    icon: IconTruck,
    description: [
      "Our Land Transport services provide reliable and efficient ground transportation solutions that complement our maritime and air freight offerings. We understand that the first and last mile are critical components of any supply chain, which is why we've developed comprehensive inland logistics capabilities.",
      "Whether you need local delivery, cross-country trucking, or intermodal solutions, our land transport network ensures your cargo reaches its final destination safely and on schedule. We offer flexible options to accommodate various cargo types, volumes, and delivery timelines.",
    ],
    features: [
      {
        title: "Door-to-Door Service",
        description:
          "Complete pickup and delivery services for seamless transportation.",
        icon: IconTruckDelivery,
      },
      {
        title: "Intermodal Solutions",
        description:
          "Efficient combinations of truck, rail, and barge transportation.",
        icon: IconRoute,
      },
      {
        title: "Real-time Tracking",
        description:
          "Advanced tracking technology for complete shipment visibility.",
        icon: IconMap,
      },
    ],
    image:
      "/trucking.jpg",
  },
  "worldwide-service": {
    title: "Worldwide Service",
    subtitle:
      "24/7 customer support across multiple time zones for reliable cargo delivery.",
    icon: IconWorld,
    description: [
      "Our Worldwide Service commitment means we're always available to assist you, regardless of your location or time zone. We understand that global logistics operates around the clock, which is why our dedicated customer service teams provide 24/7 support to address your inquiries, resolve issues, and keep your shipments moving.",
      "With multilingual staff and regional expertise, we offer personalized assistance that understands your unique market challenges and requirements. Our proactive approach to customer service means we anticipate potential issues and communicate transparently throughout the shipping process.",
    ],
    features: [
      {
        title: "24/7 Support",
        description:
          "Round-the-clock assistance from our dedicated customer service team.",
        icon: IconHeadset,
      },
      {
        title: "Multilingual Staff",
        description:
          "Communication in multiple languages to serve our diverse global clientele.",
        icon: IconUsers,
      },
      {
        title: "Proactive Updates",
        description:
          "Regular status updates and immediate notification of any changes or delays.",
        icon: IconClock,
      },
    ],
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  "custom-solutions": {
    title: "Custom Solutions",
    subtitle:
      "Tailored logistics solutions for specialized cargo and unique routing requirements.",
    icon: IconPackage,
    description: [
      "Our Custom Solutions service recognizes that standard shipping options don't always meet the unique requirements of specialized cargo or complex supply chains. We work closely with you to develop tailored logistics strategies that address your specific challenges and objectives.",
      "From oversized equipment and hazardous materials to time-sensitive deliveries and complex project logistics, our team has the expertise to design and implement customized solutions that ensure safe, efficient, and compliant transportation of your valuable cargo.",
    ],
    features: [
      {
        title: "Project Cargo",
        description:
          "Specialized handling for oversized and heavy-lift shipments.",
        icon: IconPackage,
      },
      {
        title: "Supply Chain Design",
        description:
          "Custom logistics strategies optimized for your specific business needs.",
        icon: IconRoute,
      },
      {
        title: "Warehousing & Distribution",
        description:
          "Flexible storage and distribution solutions integrated with transportation services.",
        icon: IconBuildingWarehouse,
      },
    ],
    image:
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
};

export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const serviceData = servicesData[service as keyof typeof servicesData];

  // If the service doesn't exist, return 404
  if (!serviceData) {
    notFound();
  }

  const ServiceIcon = serviceData.icon;

  return (
    <Container size="lg" py="xl">
      <Card shadow="md" radius="lg" padding="xl" withBorder>
        <CardSection>
          <div style={{ position: "relative" }}>
            <Image
              src={serviceData.image}
              alt={serviceData.title}
              height={400}
              fit="cover"
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                width: "100%",
                padding: "0 2rem",
              }}
            >
              <Center mb="lg">
                <div className={styles.serviceIcon}>
                  <ServiceIcon size={60} stroke={1.5} color={brandColor[7]} />
                </div>
              </Center>
              <Title ta="center" c="white" size="h1" mb="sm">
                {serviceData.title}
              </Title>
              <Text ta="center" c="white" size="xl" maw={800} mx="auto">
                {serviceData.subtitle}
              </Text>
            </div>
          </div>
        </CardSection>

        <Stack gap="xl" mt="xl">
          {serviceData.description.map((paragraph, index) => (
            <Text key={index} size="lg" lh={1.7}>
              {paragraph}
            </Text>
          ))}
        </Stack>

        <Title order={2} size="h2" mt="xl" mb="lg">
          Our Services Include
        </Title>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          {serviceData.features.map((feature, index) => {
            const FeatureIcon = feature.icon;
            return (
              <Card key={index} padding="lg" radius="md" withBorder shadow="sm">
                <FeatureIcon
                  size={40}
                  color={brandColor[7]}
                  style={{ marginBottom: "1rem" }}
                />
                <Text fw={600} size="lg" mb="xs">
                  {feature.title}
                </Text>
                <Text size="md" c="dimmed">
                  {feature.description}
                </Text>
              </Card>
            );
          })}
        </SimpleGrid>

        <CardSection mt="xl" inheritPadding py="xl">
          <Box
            style={{
              backgroundColor: "#f8f9fa",
              padding: "2rem",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <Title order={2} size="h2" mb="md">
              Ready to Get Started?
            </Title>
            <Text size="lg" maw={700} mx="auto" mb="xl">
              Contact our team today to learn more about our{" "}
              {serviceData.title.toLowerCase()} services and how we can help
              optimize your logistics operations.
            </Text>
            <ContactButton />
          </Box>
        </CardSection>
      </Card>
    </Container>
  );
}
