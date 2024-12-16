import { IconInfinity } from "@tabler/icons-react";
import { Group, Image, Title } from "@mantine/core";
import React from "react";

export default function AppLogo() {
  return (
    <Group gap="xs">
      <Image src="/gmt_logo.png" alt="ProofKit" width={32} height={32} />
      <Title visibleFrom="md" order={2} c={"brand.1"}>
        Global Marine Transportation
      </Title>
      <Title hiddenFrom="md" order={2} c={"brand.1"}>
        GMT
      </Title>
    </Group>
  );
}
