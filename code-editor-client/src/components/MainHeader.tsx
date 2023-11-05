import {
  Button,
  Flex,
  Heading,
  Image,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import HamburgerMenuButton from "./HamburgerMenuButton";
import logo from "../assets/logo-transparent.png";
import { logout } from "../utils/aws-amplify-helpers";
import { MouseEventHandler, useState } from "react";
import { CognitoUser } from "@aws-amplify/auth";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import ConfirmCodeModal from "./ConfirmCodeModal";

interface MainHeaderProps {
  user: CognitoUser | null;
  setUser: Function;
  replaceEditorContent: (content: string) => void;
  appendEditorContent: (content: string) => void;
  onLibraryOpen: MouseEventHandler;
  onLoginOpen: MouseEventHandler;
  onLoginClose: MouseEventHandler;
  isLoginOpen: boolean;
  onSignupOpen: MouseEventHandler;
  onSignupClose: MouseEventHandler;
  isSignupOpen: boolean;
}

const MainHeader = ({
  user,
  setUser,
  replaceEditorContent,
  appendEditorContent,
  onLibraryOpen,
  onLoginOpen,
  onLoginClose,
  isLoginOpen,
  onSignupOpen,
  onSignupClose,
  isSignupOpen,
}: MainHeaderProps) => {
  const {
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
    isOpen: isConfirmOpen,
  } = useDisclosure();
  const handleLogoutClick = () => {
    console.log("Logout button was clicked");
    logout();
    setUser(null);
  };

  // const handleConfirmCodeClick = () => {
  //   console.log("Confirm user code was clicked");
  //   confirmUserCode();
  // };

  return (
    <Flex
      height='100px'
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
      <Flex align='center'>
        <Heading size='lg' fontWeight='bold' color='#0096FF'>
          <Flex align='center' px={4}>
            <Image src={logo} boxSize='40px' alt='Logo' mr={2} />
            Umbra
          </Flex>
        </Heading>
      </Flex>
      <Flex align='center' justify='center' px={10}>
        <Button
          bg='transparent'
          color='black'
          fontSize='18px'
          _hover={{
            color: "#0096FF",
            fontWeight: "bold",
            // textShadow: "1px 1px 4px black, 0 0 2em black, 0 0 0.3em black",
          }}
          onClick={user ? handleLogoutClick : onLoginOpen}
          _active={{ bg: "transparent" }}
        >
          {user ? "Logout" : "Login"}
        </Button>
        <Button
          bg='transparent'
          color='black'
          fontSize='18px'
          _hover={{
            color: "#0096FF",
            fontWeight: "bold",
          }}
          onClick={
            localStorage.getItem("unconfirmedUser")
              ? onConfirmOpen
              : onSignupOpen
          }
          _active={{ bg: "transparent" }}
        >
          {localStorage.getItem("unconfirmedUser")
            ? "Pending Signup - Verify Email Code"
            : "Sign Up"}
        </Button>
      </Flex>
      <Spacer />
      <Flex align='center' gap={10}>
        <Button
          bg='#0096FF'
          color='white'
          fontSize='22px'
          _hover={{
            bg: "#04BCF9",
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
      </Flex>
      <LoginModal
        onOpen={onLoginOpen}
        onClose={onLoginClose}
        isOpen={isLoginOpen}
        setUser={setUser}
      />
      <SignUpModal
        onOpen={onSignupOpen}
        onClose={onSignupClose}
        isOpen={isSignupOpen}
      />
      <ConfirmCodeModal
        setUser={setUser}
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
        onOpen={onConfirmOpen}
      />
    </Flex>
  );
};

export default MainHeader;
