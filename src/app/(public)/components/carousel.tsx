"use client";

import { Carousel as MantineCarousel, CarouselSlide } from "@mantine/carousel";
import { Image } from "@mantine/core";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

export default function HeroCarousel() {
  const autoplay = useRef(Autoplay({ delay: 2000 }));

  return (
    <MantineCarousel
      slideSize="70%"
      height={200}
      slideGap="md"
      loop
      dragFree
      draggable={false}
      withControls={false}
      withIndicators
    >
      <CarouselSlide>
        <Image
          src="/shipping-hero.jpg"
          alt="Shipping hero image"
          fit="cover"
          w={"100%"}
          h={"320px"}
          radius={"sm"}
        />
      </CarouselSlide>
      <CarouselSlide>
        <Image
          src="/shipping-hero.jpg"
          alt="Shipping hero image"
          fit="cover"
          w={"100%"}
          h={"320px"}
          radius={"sm"}
        />
      </CarouselSlide>
      <CarouselSlide>
        <Image
          src="/shipping-hero.jpg"
          alt="Shipping hero image"
          fit="cover"
          w={"100%"}
          h={"320px"}
          radius={"sm"}
        />
      </CarouselSlide>
    </MantineCarousel>
  );
}
