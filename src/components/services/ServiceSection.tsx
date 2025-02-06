"use client";

import { Container, SimpleGrid } from "@mantine/core";
import React, { useState } from "react";
import styles from "../../app/(public)/page.module.css";
import { services } from "@/data/services";
import { ServiceCard } from "./ServiceCard";
import { ServiceDetail } from "./ServiceDetail";

export default function ServiceSection() {
  const [selectedService, setSelectedService] = useState<number>(0);

  const handleCardClick = (index: number) => {
    setSelectedService(index);
  };

  const handleNextService = () => {
    setSelectedService((prev) => (prev + 1) % services.length);
  };

  const handlePrevService = () => {
    setSelectedService(
      (prev) => (prev - 1 + services.length) % services.length
    );
  };

  return (
    <>
      <Container size="xl" className={styles.cardsContainer}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} spacing="lg">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </SimpleGrid>
      </Container>
      <ServiceDetail
        service={services[selectedService]}
        onNext={handleNextService}
        onPrevious={handlePrevService}
      />
    </>
  );
}
