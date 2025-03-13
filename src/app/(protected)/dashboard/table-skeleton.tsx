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
        <Group justify="space-between" px="md" py="xs">
          {[1, 2, 3, 4, 5].map((index) => (
            <Skeleton
              key={index}
              height={20}
              width={`${Math.floor(100 / 6)}%`}
            />
          ))}
        </Group>

        {/* Table rows skeleton */}
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <Group key={rowIndex} justify="space-between" px="md" py="xs">
            {[1, 2, 3, 4, 5].map((colIndex) => (
              <Skeleton
                key={colIndex}
                height={16}
                width={`${Math.floor(100 / 6)}%`}
                radius="sm"
              />
            ))}
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
