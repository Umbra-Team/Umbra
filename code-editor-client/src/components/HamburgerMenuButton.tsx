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
      <MenuButton as={Button} 
        bg='white'
        border="1p solid gray"
        borderWidth='1px'
        borderColor='gray'
        borderRadius="6px"
        p={1}
        _hover={{ bg: "#C2DFFF" }}
      >
        {/* <HamburgerIcon border="1px solid" borderRadius="3px" p={1} boxSize={8} bg="#FFFFFF" color='gray' /> */}
        <HamburgerIcon color='gray'/>
      </MenuButton>
      <MenuList bgColor='gray.800'>
        <MenuItem
          bgColor='gray.800'
          textColor="white"
          _hover={{ color: "blue.400" }}
          _focus={{ color: "blue.400" }}
          onClick={() => replaceEditorContent("")}
        >
          Clear Editor
        </MenuItem>
        <MenuItem
          bgColor='gray.800'
          textColor="white"
          _hover={{ color: "blue.400" }}
          _focus={{ color: "blue.400" }}
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
