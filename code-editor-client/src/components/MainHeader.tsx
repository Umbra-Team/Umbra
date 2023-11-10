import {
  Button,
  Flex,
  Heading,
  Image,
  Spacer,
  useDisclosure,
  Tooltip,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { CheckCircleIcon, InfoIcon } from "@chakra-ui/icons";
import ColorModeButton from "./ColorModeButton";
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
      px={6}
      bg={'transparent'}
    >
      <Flex pt={2}>
        <Heading size='lg' fontWeight='bold' color='blue.500'>
          <Flex align='center' px={4} mb={1.5}>
            <Image src={logo} boxSize='60px' alt='Logo' mr={2} />
            Umbra
          </Flex>
        </Heading>
      </Flex>
      <Flex align="baseline">
        <ShareRoomButton />
        <Text
          mx={2}
          color={"lightblue.600"}
          fontSize="18px"
          fontWeight={700}
        >
          Share and Edit Collaboratively
        </Text>
      </Flex>
      <Spacer />
      <Flex align='center' gap={2}>
        <Flex align='baseline' px={10}>
        {user ? (
          <Flex
            color={'#F58A51'}
            marginRight={'15px'} 
          >
            <Text
              bg={useColorModeValue("green.100", "green.900")}
              color={useColorModeValue("green.800", "green.400")}
              fontWeight={300}
              p={1}
              mr={1}
              border = "1px solid"
              borderColor={useColorModeValue("green.700", "green.500")}
              borderRadius="2px"
            >
              <CheckCircleIcon pb={1} pr={1}/>
              Logged in as {user.attributes.email}
            </Text>
          </Flex>
        ) : (
          <Flex
            color={'#F58A51'}
            marginRight={'15px'} 
          >
            <Text
              bg={useColorModeValue("orange.100", "orange.900")}
              color={useColorModeValue("orange.800", "orange.300")}
              fontWeight={300}
              p={1}
              mr={1}
              border="1px solid"
              borderColor={useColorModeValue("orange.700", "orange.400")}
              borderRadius="2px"
            >
              <InfoIcon pb={1} pr={1} />
              Not Logged In
            </Text>
          </Flex>
        )}
        <Button
          bg='transparent'
          color={useColorModeValue('black', 'gray.100')}
          fontSize='18px'
          fontWeight="bold"
          _hover={{
            color: "blue.500",
          }}
          onClick={user ? handleLogoutClick : onLoginOpen}
          _active={{ bg: "transparent" }}
        >
          {loginButtonContent}
        </Button>
        </Flex>
        <Tooltip

          bg={useColorModeValue("yellow.200", "yellow.900")}
          color={useColorModeValue("gray.600", "white")}
          maxW="200px"
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
        <ColorModeButton />
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
