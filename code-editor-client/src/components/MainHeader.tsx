import {
  Button,
  Flex,
  Heading,
  Image,
  Spacer,
  useDisclosure,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { CheckCircleIcon, InfoIcon } from "@chakra-ui/icons";
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

  // what to display where 'Login' button goes
  let loginButtonContent;
  if (localStorage.getItem("umbraPasswordResetEmail")) {
    loginButtonContent = "Verify Password Reset";
  } else if (user) {
    loginButtonContent = "Logout";
  } else {
    loginButtonContent = "Login";
  }

  // what to display where 'Sign Up' button goes
  let signupButtonContent;
  if (user) {
    signupButtonContent = null;
  } else if (localStorage.getItem("unconfirmedUser")) {
    signupButtonContent = "Pending Signup - Verify Email Code";
  } else {
    signupButtonContent = "Sign Up";
  }

  return (
    <Flex
      height='100px'
      flex={0.4}
      align='center'
      justify='space-between'
      // p={2}
      px={6}
      bg='#FFFFFF'
      // bgGradient='linear(to-r, black, gray.100, blue.800)'
      // border='2px'
      // borderColor='gray.200'
    >
      <Flex pt={2}>
        <Heading size='lg' fontWeight='bold' color='blue.500'>
          <Flex align='center' px={4} mb={1.5}>
            <Image src={logo} boxSize='60px' alt='Logo' mr={2} />
            Umbra
          </Flex>
        </Heading>
      </Flex>
      <ShareRoomButton />
      <Spacer />
      <Flex align='center' gap={2}>
        <Flex align='baseline' px={10}>
          {user ? (
            <Flex color={"#F58A51"} fontWeight={"700"} marginRight={"15px"}>
              <Text
                bg='green.100'
                color='green.800'
                p={1}
                mr={1}
                border='1px solid'
                borderColor='green.700'
                borderRadius='2px'
              >
                <CheckCircleIcon pr={1} />
                Logged in as {user.attributes.email}
              </Text>
            </Flex>
          ) : (
            <Flex color={"#F58A51"} fontWeight={"700"}>
              <Text
                bg='orange.100'
                color='orange.800'
                p={1}
                mr={1}
                border='1px solid'
                borderColor='orange.700'
                borderRadius='2px'
              >
                <InfoIcon pr={1} />
                Not Logged In
              </Text>
            </Flex>
          )}
          <Button
            bg='transparent'
            color='black'
            fontSize='18px'
            fontWeight='bold'
            _hover={{
              color: "blue.500",
            }}
            onClick={user ? handleLogoutClick : onLoginOpen}
            _active={{ bg: "transparent" }}
          >
            {loginButtonContent}
          </Button>

          {signupButtonContent && (
            <Button
              bg='transparent'
              color='black'
              fontSize='18px'
              fontWeight='bold'
              _hover={{
                color: "blue.500",
              }}
              onClick={
                localStorage.getItem("unconfirmedUser")
                  ? onConfirmOpen
                  : onSignupOpen
              }
              _active={{ bg: "transparent" }}
            >
              {signupButtonContent}
            </Button>
          )}
        </Flex>
        <Tooltip
          bg={"orange.200"}
          maxW='175px'
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
