import { IconButton, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

const ColorModeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      icon={
        colorMode === "dark" ? (
          <SunIcon color='white' />
        ) : (
          <MoonIcon color='white' />
        )
      }
      onClick={toggleColorMode}
      variant='solid'
      bg='blue.500'
      aria-label='Toggle color mode'
      _hover={{ bg: "umbra.deepSkyBlue" }}
    />
  );
};

export default ColorModeButton;
