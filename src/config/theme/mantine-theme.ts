import { createTheme, type MantineColorsTuple } from "@mantine/core";

// generate your own set of colors here: https://mantine.dev/colors-generator
export const brandColor: MantineColorsTuple = [
  "#ebf3ff",
  "#d7e3f7",
  "#adc4ec",
  "#81a4e2",
  "#5c88da",
  "#4477d5",
  "#376ed4",
  "#295dbc",
  "#2052a9",
  "#104796"
];

export const theme = createTheme({
  primaryColor: "brand",
  colors: {
    brand: brandColor,
  },
});

export const headerColor = "#003366";
