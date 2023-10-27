import { Menu, MenuButton, MenuItem, Button, MenuList } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const HamburgerMenuButton = ({
  setCode,
  yText,
  replaceEditorContent,
  appendEditorContent,
}) => {
  return (
    <Menu>
      <MenuButton as={Button}>
        <HamburgerIcon boxSize={6} color='gray.900' />
      </MenuButton>
      <MenuList bgColor='gray.100'>
        <MenuItem
          bgColor='gray.100'
          _hover={{ color: "blue.500" }}
          _focus={{ color: "blue.500" }}
          onClick={() => replaceEditorContent("this is some new content")}
        >
          Settings
        </MenuItem>
        <MenuItem
          bgColor='gray.100'
          _hover={{ color: "blue.500" }}
          _focus={{ color: "blue.500" }}
          onClick={() =>
            appendEditorContent("const hello = () => console.log('hello!');")
          }
        >
          Library
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default HamburgerMenuButton;
