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
    localStorage.removeItem("unconfirmedUser");
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
      <Flex>
        <Heading size='lg' fontWeight='bold' color='blue.500'>
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
          fontWeight="bold"
          _hover={{
            color: "blue.500",
            // fontWeight: "bold",
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
          {localStorage.getItem("unconfirmedUser")
            ? "Pending Signup - Verify Email Code"
            : "Sign Up"}
        </Button>

      </Flex>
      <Spacer />
      <Flex align='center' gap={3}>
        {/* {user ? (
          <Flex
            color={'#F58A51'}
            fontWeight={'700'}
            marginRight={'15px'} 
          >
            {user.attributes.email} 
          </Flex>
        ) : (
          <Flex
            color={'#F58A51'}
            fontWeight={'700'}
            marginRight={'15px'} 
          >
            Not Logged In
          </Flex>
        )} */}
        <ShareRoomButton />
        {user ? (
          <Flex
            color={'#F58A51'}
            fontWeight={'700'}
            marginRight={'15px'} 
          >
            {user.attributes.email} 
          </Flex>
        ) : (
          <Flex
            color={'#F58A51'}
            fontWeight={'700'}
            marginRight={'15px'} 
          >
            Not Logged In
          </Flex>
        )}
        <Tooltip
          bg={"orange.200"}
          maxW="250px"
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
