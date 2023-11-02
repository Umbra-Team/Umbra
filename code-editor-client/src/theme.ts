import { extendTheme } from '@chakra-ui/react'

import '@fontsource/raleway';
import '@fontsource/nunito';
import '@fontsource/crimson-pro';

export const theme = extendTheme({
  colors: {
    gray: {
      100: "#1E1E1E",
      200: "#252526",
      800: "#D4D4D4",
      900: "#F8F8F8",
    },
    blue: {
      500: "#007ACC",
    },
  },
  fonts: {
    body: "'Crimson Pro', sans-serif",
    heading: "'Nunito', serif",
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});