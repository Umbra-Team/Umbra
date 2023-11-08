import { extendTheme } from "@chakra-ui/react";

import "@fontsource/raleway";
import "@fontsource/nunito";
import "@fontsource/crimson-pro";

export const theme = extendTheme({
  colors: {
    umbra: {
      logoText: "#0096FF",
      vividSkyBlue: "#00D0F7",
      black: "#000000",
      white: "#FFFFFF",
      pictonBlue: "#00B2FF",
      deepSkyBlue: "#04BCF9",
      softBlack: "#040404",
      azul: "#0471c8",
      midnightGreen: "#044f65",
      prussianBlue: "#043554",
    },
    gray: {
      100: "#1E1E1E",
      200: "#252526",
      800: "#D4D4D4",
      900: "#F8F8F8",
    },
    blue: {
      500: "#0096FF",
    },
  },
  fonts: {
    body: "'Nunito', serif",
    heading: "'Nunito', serif",
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});
