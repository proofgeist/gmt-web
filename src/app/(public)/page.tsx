import { Title, Image, Box } from "@mantine/core";
import styles from "./page.module.css";
import dynamic from "next/dynamic";

const ServiceSection = dynamic(
  () => import("@/components/services/ServiceSection"),
  { ssr: true }
);

export default function Home() {
  return (
    <Box
      style={{
        minHeight: "calc(100vh - 60px)",
        width: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "2rem 0",
        marginTop: "-7rem",
      }}
    >
      <Box
        style={{
          padding: "0rem 0rem 20rem 4rem",
          maxWidth: "800px",
          textAlign: "left",
        }}
      >
        <Image
          src="/gmt_logo.png"
          alt="ProofKit"
          p={4}
          maw={84}
          height={84}
          radius={"md"}
          fit="contain"
        />
        <Title className={styles.mainTitle}>
          GLOBAL MARINE
          <br />
          TRANSPORTATION
        </Title>
        <Title order={2} className={styles.tagline}>
          Your Trusted Shipping Partner for a Connected World
        </Title>
      </Box>

      <ServiceSection />
    </Box>
  );
}
