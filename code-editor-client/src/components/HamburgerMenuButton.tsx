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
      <MenuButton as={Button} bg='white' border="1p solid gray" borderWidth='1px' borderColor='gray' borderRadius="6px" p={1}>
        {/* <HamburgerIcon border="1px solid" borderRadius="3px" p={1} boxSize={8} bg="#FFFFFF" color='gray' /> */}
        <HamburgerIcon color='gray'/>
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
