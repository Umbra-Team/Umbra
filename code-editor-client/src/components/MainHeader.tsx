import { Box, Button, Flex, Heading, Image, Spacer, Divider } from "@chakra-ui/react";
import HamburgerMenuButton from "./HamburgerMenuButton";
import logo from '../assets/logo-transparent.png';
import {
  signUp,
  confirmUserCode,
  logout,
  signIn,
} from "../utils/aws-amplify-helpers";
import { MouseEventHandler } from "react";
import { CognitoUser } from "@aws-amplify/auth";

interface MainHeaderProps {
  user: CognitoUser | null;
  setUser: Function;
  replaceEditorContent: (content: string) => void;
  appendEditorContent: (content: string) => void;
  onLibraryOpen: MouseEventHandler;
}

const MainHeader = ({
  user,
  setUser,
  replaceEditorContent,
  appendEditorContent,
  onLibraryOpen,
}: MainHeaderProps) => {
  // Click handlers
  const handleLoginClick = () => {
    console.log("Login button was clicked");
    signIn(setUser);
  };

  const handleLogoutClick = () => {
    console.log("Logout button was clicked");
    logout();
    setUser(null);
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
      height="100px"
      flex={0.4}
      align='center'
      justify='space-between'
      p={4}
      px={6}
      bg='#FFFFFF'
      // bgGradient='linear(to-r, black, gray.100, blue.800)'
      // border='2px'
      // borderColor='gray.200'
    >
<<<<<<< HEAD

      <Flex align="center">
        <Heading size='lg' fontWeight='bold' color='#0096FF'>
        <Flex align='center' px={4}>
          <Image src={logo} boxSize="40px" alt="Logo" mr={2} />
          Umbra
        </Flex>
        </Heading>
      </Flex>
      <Flex align='center' justify="center" px={10}>
      <Button
        bg='transparent'
        color='black'
        fontSize='18px'
        _hover={{
          color: "#0096FF",
          fontWeight: "bold",
          // textShadow: "1px 1px 4px black, 0 0 2em black, 0 0 0.3em black",
        }}
        onClick={isLoggedIn ? handleLogoutClick : handleLoginClick}
        _active={{ bg: "transparent" }}
      >
        {isLoggedIn ? "Logout" : "Login"}
      </Button>
      <Button
        bg='transparent'
        color='black'
        fontSize='18px'
        _hover={{
          color: "#0096FF",
          fontWeight: "bold",
          // textShadow: "1px 1px 4px black, 0 0 2em black, 0 0 0.3em black",
        }}
        onClick={handleSignUpClick}
        _active={{ bg: "transparent" }}
      >
        Sign Up
      </Button>
      <Button
        bg='transparent'
        color='black'
        fontSize='18px'
        _hover={{
          color: "#0096FF",
          fontWeight: "bold",
          // textShadow: "1px 1px 4px black, 0 0 2em black, 0 0 0.3em black",
        }}
        onClick={handleConfirmCodeClick}
        _active={{ bg: "transparent" }}
      >
        Confirm User Code
      </Button>
      </Flex>
      <Spacer />
      <Flex align='center'  gap={10}>
      <Button
        bg='#0096FF'
        color='white'
        fontSize='22px'
        _hover={{
         bg: '#04BCF9' 
        }}
        onClick={onLibraryOpen}
        _active={{ bg: "transparent" }}
      >
        Library
      </Button>
      <HamburgerMenuButton
        replaceEditorContent={replaceEditorContent}
        appendEditorContent={appendEditorContent}
      />
=======
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
          onClick={user ? handleLogoutClick : handleLoginClick}
          _active={{ bg: "transparent" }}
        >
          {user ? "Logout" : "Login"}
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
>>>>>>> main
      </Flex>
    </Flex>
  );
};

export default MainHeader;
