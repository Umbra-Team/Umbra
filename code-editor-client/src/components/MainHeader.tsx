import {
  Button,
  Flex,
  Heading,
  Image,
  Spacer,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";
import HamburgerMenuButton from "./HamburgerMenuButton";
import logo from "../assets/logo-transparent.png";
import { logout } from "../utils/aws-amplify-helpers";
import { MouseEventHandler, useState } from "react";
import { CognitoUser } from "@aws-amplify/auth";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import ConfirmCodeModal from "./ConfirmCodeModal";
import ShareRoomButton from "./ShareRoomButton";
import { ToastPropsType } from "./UmbraToast";
import { ExtendedCognitoUser } from "../types/types";

interface MainHeaderProps {
  user: ExtendedCognitoUser | null;
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
  toastProps: ToastPropsType | null;
  setToastProps: Function;
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
  toastProps,
  setToastProps,
}: MainHeaderProps) => {
  const {
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
    isOpen: isConfirmOpen,
  } = useDisclosure();

  const handleLogoutClick = () => {
    console.log("Logout button was clicked");
    logout();
    setToastProps({
      title: "Logout Successful",
      description: user ? `${user.attributes.email}` : "Unknown user",
      status: "success",
    });
    localStorage.removeItem("unconfirmedUser");
    setUser(null);
  };

  let loginButtonContent;
  if (localStorage.getItem("umbraPasswordResetEmail")) {
    loginButtonContent = "Verify Password Reset";
  } else if (user) {
    loginButtonContent = "Logout";
  } else {
    loginButtonContent = "Login";
  }

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
      <Flex>
        <Heading size='lg' fontWeight='bold' color='#0096FF'>
          <Flex align='center' px={4} mb={1.5}>
            <Image src={logo} boxSize='60px' alt='Logo' mr={2} />
            Umbra
          </Flex>
        </Heading>
      </Flex>
      <Flex align='baseline' justify='center' px={10}>
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
          {loginButtonContent}
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
        <ShareRoomButton />
        <Tooltip
          label={
            user
              ? "Open your code snippet library"
              : "Sign up for an account to save your snippets"
          }
          fontSize='md'
        >
          <Button
            bg='umbra.logoText'
            color='white'
            fontSize='22px'
            _hover={{
              bg: "umbra.deepSkyBlue",
            }}
            onClick={onLibraryOpen}
            _active={{ bg: "transparent" }}
          >
            Library
          </Button>
        </Tooltip>
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
        toastProps={toastProps}
        setToastProps={setToastProps}
      />
      <SignUpModal
        onOpen={onSignupOpen}
        onClose={onSignupClose}
        isOpen={isSignupOpen}
        toastProps={toastProps}
        setToastProps={setToastProps}
      />
      <ConfirmCodeModal
        setUser={setUser}
        isOpen={isConfirmOpen}
        onClose={onConfirmClose}
        onOpen={onConfirmOpen}
        toastProps={toastProps}
        setToastProps={setToastProps}
      />
    </Flex>
  );
};

export default MainHeader;
