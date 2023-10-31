import { Menu, MenuButton, MenuItem, Button, MenuList } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

interface HamburgerMenuButtonProps {
  replaceEditorContent: (content: string) => void;
  appendEditorContent: (content: string) => void;
}

const HamburgerMenuButton = ({
  replaceEditorContent,
  appendEditorContent,
}: HamburgerMenuButtonProps) => {
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
          onClick={() => replaceEditorContent("")}
        >
          Clear Editor
        </MenuItem>
        <MenuItem
          bgColor='gray.100'
          _hover={{ color: "blue.500" }}
          _focus={{ color: "blue.500" }}
          onClick={() =>
            appendEditorContent("const hello = () => console.log('hello!');")
          }
        >
          Append Editor Content
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default HamburgerMenuButton;
