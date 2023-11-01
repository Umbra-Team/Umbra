import { Button, Flex, Heading } from "@chakra-ui/react";
import HamburgerMenuButton from "./HamburgerMenuButton";
import {
  signUp,
  confirmUserCode,
  logout,
  signIn,
} from "../utils/aws-amplify-helpers";
import { MouseEventHandler } from "react";

interface MainHeaderProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  replaceEditorContent: (content: string) => void;
  appendEditorContent: (content: string) => void;
  onLibraryOpen: MouseEventHandler;
}

const MainHeader = ({
  isLoggedIn,
  setIsLoggedIn,
  replaceEditorContent,
  appendEditorContent,
  onLibraryOpen,
}: MainHeaderProps) => {
  // Click handlers
  const handleLoginClick = () => {
    console.log("Login button was clicked");
    signIn();
    setIsLoggedIn(true);
  };

  const handleLogoutClick = () => {
    console.log("Logout button was clicked");
    logout();
    setIsLoggedIn(false);
  };

  const handleSignUpClick = () => {
    console.log("SignUp button was clicked");
    signUp();
  };

  const handleConfirmCodeClick = () => {
    console.log("Confirm user code was clicked");
    confirmUserCode();
  };

  return (
    <Flex
      flex={1}
      align='center'
      justify='space-between'
      p={6}
      // bg='gray.200'
      bgGradient='linear(to-r, black, gray.100, blue.800)'
      border='2px'
      borderColor='gray.200'
    >
      <Heading size='lg' fontWeight='bold' color='gray.900'>
        Umbra
      </Heading>
      <Flex align='center' gap={10}>
        <Button
          bg='transparent'
          _hover={{
            color: "white",
            fontWeight: "bold",
            textShadow: "1px 1px 4px black, 0 0 2em black, 0 0 0.3em black",
          }}
          onClick={isLoggedIn ? handleLogoutClick : handleLoginClick}
          _active={{ bg: "transparent" }}
        >
          {isLoggedIn ? "Logout" : "Login"}
        </Button>
        <Button
          bg='transparent'
          _hover={{
            color: "white",
            fontWeight: "bold",
            textShadow: "1px 1px 4px black, 0 0 2em black, 0 0 0.3em black",
          }}
          onClick={handleSignUpClick}
          _active={{ bg: "transparent" }}
        >
          Sign Up
        </Button>
        <Button
          bg='transparent'
          _hover={{
            color: "white",
            fontWeight: "bold",
            textShadow: "1px 1px 4px black, 0 0 2em black, 0 0 0.3em black",
          }}
          onClick={handleConfirmCodeClick}
          _active={{ bg: "transparent" }}
        >
          Confirm User Code
        </Button>
        <Button
          bg='transparent'
          fontSize='20px'
          _hover={{
            color: "white",
            fontWeight: "bold",
            textShadow: "1px 1px 4px black, 0 0 2em black, 0 0 0.3em black",
          }}
          onClick={onLibraryOpen}
          _active={{ bg: "transparent" }}
        >
          Code Library
        </Button>
        <HamburgerMenuButton
          replaceEditorContent={replaceEditorContent}
          appendEditorContent={appendEditorContent}
        />
      </Flex>
    </Flex>
  );
};

export default MainHeader;
