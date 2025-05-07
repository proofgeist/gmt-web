import { createTheme, type MantineColorsTuple } from "@mantine/core";

// generate your own set of colors here: https://mantine.dev/colors-generator
export const brandColor: MantineColorsTuple = [
  "#ededfc",
  "#d6d6f4",
  "#aaa9eb",
  "#7c7ae2",
  "#5652dc",
  "#3e39d8",
  "#332cd7",
  "#2721bf",
  "#201cab",
  "#171796",
];

export const theme = createTheme({
  primaryColor: "brand",
  colors: {
    brand: brandColor,
  },
});

export const headerColor = "#171796";
