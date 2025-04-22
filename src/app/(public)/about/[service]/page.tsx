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
  IconShield,
  IconRoute,
  IconClock,
  IconChartBar,
  IconUsers,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { ContactButton } from "../contact-button";
import { brandColor } from "@/config/theme/mantine-theme";

// Define the service data
const servicesData = {
  "ocean-transportation": {
    title: "Ocean Transportation",
    subtitle: "World Class Customer Service",
    icon: IconShip,
    description: [
      "At the heart of our operations is our dedication to customer satisfaction. Whether it's expedited shipping, specialized handling for fumigation or hazardous materials, we collaborate closely with our clients to create customized shipping solutions that address their specific business requirements.",
      "At Global Marine Transportation Inc., we ensure your freight moves effortlessly across the globe with our extensive network of shipping services and highly competitive freight rates.",
      "We deliver a comprehensive array of solutions and personalized service for all your international full container shipping needs.",
    ],
    features: [
      {
        title: "Integrated Support Network",
        description:
          "We honor our customers with the service of the best agents providing loading-dock-to-final-delivery transparency to ensure secure, consistent service.",
        icon: IconUsers,
      },
      {
        title: "Global Reliability",
        description:
          "Our reputation for reliability and efficiency is built on decades of experience in the freight transportation industry.",
        icon: IconShield,
      },
      {
        title: "Pricing Transparency",
        description:
          "Our rates are straightforward throughout your booking, whether you need to move a single load or contract rates on your most-used lanes.",
        icon: IconChartBar,
      },
    ],
    image: "/ship-image-7.jpg",
    contactImage: "/customer-service-image-1.jpg",
  },
  "inland-transportation": {
    title: "Inland Transportation",
    subtitle: "Driven to Deliver",
    icon: IconTruck,
    description: [
      "GMT provides comprehensive door-to-door domestic and international freight services via road and rail. Our selected transport partners ensure operational excellence, traceability, security, and above all, reliability.",
      "We are connected to a nationwide network of over-the-road carriers strictly selected for reliability and professionalism.",
      "We offer a variety of large transport options, including box trailers, refrigerated trailers, flatbeds, curtain-sided trailers, semi-mega tautliners, trucks, and vans.",
    ],
    features: [
      {
        title: "Full Truckload (FTL) Transport",
        description: "Direct transport from origin to destination.",
        icon: IconTruckDelivery,
      },
      {
        title: "Cross Border Transportation",
        description:
          "International FTL transport with complex customs clearance.",
        icon: IconWorld,
      },
      {
        title: "Multimodal Transport",
        description:
          "Shipments using multiple modes of transportation (truck, rail, ferry, barge).",
        icon: IconRoute,
      },
    ],
    image: "/trucking-image-2.jpg",
    contactImage: "/customer-service-image-2.jpg",
  },
  fumigation: {
    title: "Fumigation",
    subtitle: "Container Fumigation Services",
    icon: IconGlobe,
    description: [
      "A shipping container is fumigated to prevent the entry of quarantined pests into a cargo's country of destination. When cargo is fumigated, special products are used to exterminate or control the international spread of pests.",
      "Container fumigation effectively controls any type of pest through a safe, efficient and dry disinfection process, typically using gas. The most common gases used are methyl bromide and phosphine.",
      "Without treatment any type of goods and their packaging can be denied entry into a destination country. To verify proper fumigation, destination authorities require written certificates or other proof of treatment.",
    ],
    features: [
      {
        title: "Professional Process",
        description:
          "Gas is injected through a probe inserted into the container with the doors already closed ensuring it is trapped inside for a specified duration of time.",
        icon: IconPackage,
      },
      {
        title: "Certification",
        description:
          "Every properly fumigated container shipment includes a fumigation certificate.",
        icon: IconShield,
      },
      {
        title: "Expert Handling",
        description:
          "Our team ensures proper fumigation according to destination country's specific requirements.",
        icon: IconUsers,
      },
    ],
    image: "/ship-image-5.jpg",
    contactImage: "/customer-service-image-3.jpg",
  },
  "cargo-insurance": {
    title: "Cargo Insurance",
    subtitle: "Safeguard Your Shipment with Cargo Insurance",
    icon: IconShield,
    description: [
      "Cargo insurance mitigates many risks associated with transporting goods by sea, air, road, or rail. It reimburses the insured for financial losses resulting from loss or damage to cargo caused by an insured risk.",
      "Protect the value of your ocean shipments with all-risk cargo insurance.",
      "Explore your policy choices to ensure your coverage matches your exposure risk.",
    ],
    features: [
      {
        title: "All Risks Coverage",
        description:
          "Comprehensive cargo insurance covers all risks of loss or damage to the cargo, except those explicitly excluded in the policy.",
        icon: IconShield,
      },
      {
        title: "Named Perils Coverage",
        description:
          "This insurance covers specific risks that may cause loss or damage to cargo as identified in the policy.",
        icon: IconPackage,
      },
      {
        title: "Open Cover",
        description:
          "An open cover policy provides continuous cargo insurance for a specified period, rather than for a single shipment.",
        icon: IconClock,
      },
    ],
    image: "/ship-image-10.jpg",
    contactImage: "/customer-service-image-4.jpg",
  },
  "customs-brokerage": {
    title: "Customs Brokerage",
    subtitle: "Navigate the Sea of Complex Regulations",
    icon: IconWorld,
    description: [
      "Trustworthy knowledge and experience for global customs brokerage services ensuring smooth movement of your goods through US ocean ports.",
      "At Global Marine Transportation Inc. we possess in-depth knowledge of commodity specifics and we're experts in entry procedures, admissibility requirements, classification, valuation and the duties and taxes on imported goods.",
      "Cross-border transaction rules and regulations are constantly evolving. As experts in the requirements for various types of goods, we can help you avoid costly delays, fines, confiscation of merchandise and other penalties.",
    ],
    features: [
      {
        title: "Expert Documentation",
        description:
          "We prepare all necessary documentation and calculate duties accurately.",
        icon: IconPackage,
      },
      {
        title: "Inspection Coordination",
        description:
          "We coordinate inspections required by governmental agencies.",
        icon: IconUsers,
      },
      {
        title: "Delivery Arrangement",
        description: "We arrange for delivery with precision and efficiency.",
        icon: IconTruckDelivery,
      },
    ],
    image: "/cargo-image-2.jpg",
    contactImage: "/customer-service-image-5.jpg",
  },
  sustainability: {
    title: "Sustainability",
    subtitle: "Doing the Right Thing Together",
    icon: IconGlobe,
    description: [
      "The shipping industry forms the backbone of global trade. By choosing ocean freight, you're already opting for the transport mode with the lowest carbon emissions.",
      "As global environmental consciousness gains momentum, the shipping industry – particularly ocean freight, is experiencing a significant shift towards sustainability.",
      "Global Marine committed to greener climate initiatives, striving to reduce our environmental footprint through innovative practices and sustainable solutions.",
    ],
    features: [
      {
        title: "Sustainable Shipping",
        description:
          "A greener fleet of ships to minimize air and water pollution and mitigate climate change.",
        icon: IconShip,
      },
      {
        title: "Environmental Protection",
        description:
          "Safeguard marine ecosystems and biodiversity through sustainable practices.",
        icon: IconGlobe,
      },
      {
        title: "Future Focus",
        description:
          "Prioritizing clean energy and eco-friendly technologies for a sustainable future.",
        icon: IconWorld,
      },
    ],
    image: "/ocean-image-1.jpg",
    contactImage: "/customer-service-image-6.jpg",
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
    <Container fluid>
      <Card shadow="md" radius={0} padding="xl">
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
              }}
            >
              <Center mb="lg">
                <div className={styles.serviceIcon}>
                  <ServiceIcon size={60} stroke={1.5} color={brandColor[8]} />
                </div>
              </Center>
              <Title ta="center" c="white" size="h1" mb="sm">
                {serviceData.title}
              </Title>
              <Text
                ta="center"
                px={"md"}
                c="white"
                size="xl"
                maw={800}
                mx="auto"
              >
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
                  color={brandColor[8]}
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
                backgroundImage: `url(${serviceData.contactImage})`,
                backgroundSize: "cover",
                backgroundPosition: "top",
                opacity: 0.4,
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
                Ready to Get Started?
              </Title>
              <Text size="lg" maw={700} mx="auto" mb="xl" ta="center">
                Contact our team today to learn more about our{" "}
                {serviceData.title.toLowerCase()} services and how we can help
                optimize your logistics operations.
              </Text>
              <ContactButton />
            </div>
          </Box>
        </CardSection>
      </Card>
    </Container>
  );
}
