import { Paper, Skeleton, Stack, Group, Title } from "@mantine/core";
import React from "react";

export default function TableSkeleton() {
  return (
    <Paper withBorder shadow="md" radius="md">
      <Stack p="md" gap="md">
        <Group justify="space-between">
          <Title order={4}>Shipment Details</Title>
          <Skeleton height={36} width={300} />
        </Group>

        {/* Table header skeleton */}
        <Group justify="space-between" px="md" py="xs" gap="md">
          <Skeleton height={20} width={140} />
          <Skeleton height={20} width={140} />
          <Skeleton height={20} width={180} />
          <Skeleton height={20} width={180} />
          <Skeleton height={20} width={150} />
          <Skeleton height={20} width={250} />
        </Group>

        {/* Table rows skeleton */}
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <Group key={rowIndex} justify="space-between" px="md" py="md" gap="md" align="flex-start">
            {/* Booking column */}
            <Stack gap={8} style={{ width: 140 }}>
              <Stack gap={4}>
                <Skeleton height={12} width={50} />
                <Skeleton height={16} width={120} />
              </Stack>
              <Stack gap={4}>
                <Skeleton height={12} width={60} />
                <Skeleton height={16} width={120} />
              </Stack>
            </Stack>

            {/* Shipper column */}
            <Stack gap={8} style={{ width: 140 }}>
              <Stack gap={4}>
                <Skeleton height={12} width={70} />
                <Skeleton height={16} width={100} />
              </Stack>
              <Stack gap={4}>
                <Skeleton height={12} width={80} />
                <Skeleton height={16} width={120} />
              </Stack>
            </Stack>

            {/* Origin column */}
            <Stack gap={8} style={{ width: 180 }}>
              <Stack gap={4}>
                <Skeleton height={12} width={50} />
                <Skeleton height={16} width={150} />
              </Stack>
              <Stack gap={4}>
                <Skeleton height={12} width={50} />
                <Skeleton height={16} width={150} />
              </Stack>
            </Stack>

            {/* Destination column */}
            <Stack gap={8} style={{ width: 180 }}>
              <Stack gap={4}>
                <Skeleton height={12} width={60} />
                <Skeleton height={16} width={150} />
              </Stack>
              <Stack gap={4}>
                <Skeleton height={12} width={50} />
                <Skeleton height={16} width={150} />
              </Stack>
            </Stack>

            {/* Dates column */}
            <Stack gap={8} style={{ width: 150 }}>
              <Stack gap={4}>
                <Skeleton height={12} width={30} />
                <Skeleton height={16} width={80} />
              </Stack>
              <Stack gap={4}>
                <Skeleton height={12} width={30} />
                <Skeleton height={16} width={80} />
              </Stack>
            </Stack>

            {/* Vessel & Status column */}
            <Stack gap={8} style={{ width: 250 }}>
              <Stack gap={4}>
                <Skeleton height={12} width={50} />
                <Skeleton height={16} width={200} />
              </Stack>
              <Stack gap={4}>
                <Skeleton height={12} width={50} />
                <Group gap="xs">
                  <Skeleton height={20} width={80} radius="xl" />
                  <Skeleton height={20} width={80} radius="xl" />
                </Group>
              </Stack>
            </Stack>
          </Group>
        ))}

        {/* Pagination skeleton */}
        <Group justify="flex-end" px="md" py="xs">
          <Skeleton height={36} width={200} />
        </Group>
      </Stack>
    </Paper>
  );
}
