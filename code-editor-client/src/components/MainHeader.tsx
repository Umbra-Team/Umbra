import {
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tooltip,
  Text,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { CheckCircleIcon, InfoIcon } from "@chakra-ui/icons";
import ColorModeButton from "./ColorModeButton";
import logo from "../assets/logo-transparent.png";
import { logout } from "../utils/aws-amplify-helpers";
import { MouseEventHandler, useState } from "react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import ConfirmCodeModal from "./ConfirmCodeModal";
import ShareRoomButton from "./ShareRoomButton";
import AudioChatButton from "./AudioChatButton"
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
  isTooltipOpen: boolean;
  onTooltipClose: () => void;
  onTooltipOpen: () => void;
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
  isTooltipOpen,
  onTooltipClose,
  onTooltipOpen,
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

  // handle library button click
  const handleLibraryClick = (event) => {
    onLibraryOpen(event);
    onTooltipClose();
  };

  // Responsive design adjustments
  const flexDir = useBreakpointValue({ base: 'column', md: 'row' }) as 'column' | 'row' | undefined;
  const paddingX = useBreakpointValue({ base: 1, sm: 2, md: 6 });
  const marginX = useBreakpointValue({ base: 1, md: 2 });
  const fontSizeText = useBreakpointValue({ base: '12px', sm: '14px', md: '16px', lg: '18px', xl: '20px'});
  const logoSize = useBreakpointValue({ base: '50px', md: '60px' });
  const displayLibraryButton = useBreakpointValue({ base: 'none', md: 'flex' });
  const umbraLogoText = useBreakpointValue({ base: '20px', md: '22px', lg: '28px' });
  const displayUmbraLogoText = useBreakpointValue({ base: 'none', lg: 'block' });
   // Responsive display values for hiding labels on small screens
  const displayLabelValue = useBreakpointValue({ base: 'none', md: 'block' });
  const displayLoggedInValue = useBreakpointValue({ base: 'none', sm: 'block' });
  // Dynamically set the display property based on the breakpoint
  const flexDisplay = useBreakpointValue({ base: 'none', md: 'flex' });

  
  const fontSizeValue = useBreakpointValue({ base: '10px', md: '12px', lg: '14px' });
  const paddingValue = useBreakpointValue({ base: '0.25rem', md: '0.5rem' });
  const marginValue = useBreakpointValue({ base: '0.25rem', md: '0.5rem' });

  // Define the responsive text content for the logged-in status
  const loggedInText = useBreakpointValue({ base: 'Logged in', md: `Logged in as ${user?.attributes.email}` }) as string | undefined;

  const loginSignupButtonFontSize = useBreakpointValue({ base: '16px', lg: '18px'});
  const libraryButtonFontSize = useBreakpointValue({ base: '18px', md: '20px', lg: '22px'});
  const buttonSize = useBreakpointValue({ base: 'sm', md: 'md' });

  const logoDisplayOnlyBelowMd = useBreakpointValue({ base: 'block', md: 'none' });

  return (
    <Flex
      height='100px'
      flex={0.4}
      align='center'
      justify='space-between'
      px={0}
      mx={0}
      gap={0}
      bg={"transparent"}
    >
      <Flex 
        pt={2}
        display={flexDisplay}
      >
        <Heading size='lg' fontWeight='bold' color='blue.500'>
          <Flex 
            align='center' 
            justify='space-between'
            px={0}
            mb={1.5}
          >
            <Image src={logo} boxSize={logoSize} alt='Logo' mr={2} />
            <Text display={displayUmbraLogoText} fontSize={umbraLogoText} fontWeight='bold' color='blue.500'>
              Umbra
            </Text>
          </Flex>
        </Heading>
      </Flex>
      <Flex 
        pt={2}
        display={logoDisplayOnlyBelowMd}
      >
        <Image 
          src={logo} 
          boxSize={logoSize} 
          alt='Logo' 
          mr={2} 
          display={logoDisplayOnlyBelowMd}
        />
      </Flex>
      <Flex align='baseline' gap={0}>
        <ShareRoomButton />
        <Text 
          display={displayLabelValue} 
          mx={2} 
          color={"lightblue.600"} 
          fontSize={fontSizeText} 
          fontWeight={700}
        >
          Multiplayer 
        </Text>
        <AudioChatButton />
        <Text 
          display={displayLabelValue} 
          mx={2}
          color={"lightblue.600"} 
          fontSize={fontSizeText} 
          fontWeight={700}        
        >
          Voice Chat 
        </Text>
      </Flex>
      <Spacer flex={{ base: 0, xl: 2 }} />
      <Flex align='center' gap={1}>
        <Flex align='baseline' px={10}>
          {user ? (
            <Flex color={"#F58A51"} marginRight={"15px"}>
              <Text
                display={displayLoggedInValue}
                bg={useColorModeValue("green.100", "green.900")}
                color={useColorModeValue("green.800", "green.400")}
                fontWeight={300}
                p={paddingValue}
                mr={marginValue}
                border='1px solid'
                borderColor={useColorModeValue("green.700", "green.500")}
                borderRadius='2px'
                fontSize={fontSizeValue}
              >
                <CheckCircleIcon pb={1} pr={1} />
                Logged in as {user.attributes.email}
              </Text>
            </Flex>
          ) : (
            <Flex color={"#F58A51"} marginRight={"15px"}>
              <Text
                bg={useColorModeValue("orange.100", "orange.900")}
                color={useColorModeValue("orange.800", "orange.300")}
                fontWeight={300}
                p={paddingValue}
                mr={marginValue}
                border='1px solid'
                borderColor={useColorModeValue("orange.700", "orange.400")}
                borderRadius='2px'
                fontSize={fontSizeValue}
              >
                <InfoIcon pb={1} pr={1} />
                Not Logged In
              </Text>
            </Flex>
          )}
          <Button
            bg='transparent'
            color={useColorModeValue("black", "gray.100")}
            fontSize={loginSignupButtonFontSize}
            fontWeight='bold'
            _hover={{
              color: "blue.500",
            }}
            mr={useBreakpointValue({ base: '0rem', md: '1rem' })}
            onClick={user ? handleLogoutClick : onLoginOpen}
            size={buttonSize}
            _active={{ bg: "transparent" }}
          >
            {loginButtonContent}
          </Button>
          {signupButtonContent && (
            <Button
              bg='transparent'
              color={useColorModeValue("black", "gray.100")}
              fontSize={loginSignupButtonFontSize}
              fontWeight='bold'
              _hover={{
                color: "blue.500",
              }}
              mr={useBreakpointValue({ base: '0rem', md: '1rem' })}
              onClick={
                localStorage.getItem("unconfirmedUser")
                  ? onConfirmOpen
                  : onSignupOpen
              }
              _active={{ bg: "transparent" }}
              size={buttonSize}
            >
              {signupButtonContent}
            </Button>
          )}
        </Flex>
        <Tooltip
          bg={useColorModeValue("yellow.200", "yellow.900")}
          color={useColorModeValue("gray.600", "white")}
          maxW='200px'
          isOpen={isTooltipOpen}
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
            fontSize={libraryButtonFontSize}
            _hover={{
              bg: "umbra.deepSkyBlue",
            }}
            onMouseEnter={onTooltipOpen}
            onMouseLeave={onTooltipClose}
            onClick={handleLibraryClick}
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
