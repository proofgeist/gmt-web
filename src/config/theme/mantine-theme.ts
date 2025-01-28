import { createTheme, type MantineColorsTuple } from "@mantine/core";

// generate your own set of colors here: https://mantine.dev/colors-generator
const brandColor: MantineColorsTuple = [
  "#ecf4ff",
  "#dce4f5",
  "#b9c7e2",
  "#94a8d0",
  "#748dc0",
  "#5f7cb7",
  "#5474b4",
  "#44639f",
  "#3a5890",
  "#2c4b80",
];

export const theme = createTheme({
  primaryColor: "brand",
  colors: {
    brand: brandColor,
  },
});

export const headerColor = "#003366";
