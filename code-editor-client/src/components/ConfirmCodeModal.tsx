import {
  Flex,
  Box,
  FormControl,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  Center,
  HStack,
  PinInput,
  PinInputField,
  Link,
  VStack,
} from "@chakra-ui/react";
import { confirmUserCode } from "../utils/aws-amplify-helpers";
import { Auth } from "aws-amplify";
import { useState } from "react";
import axios from "axios";

const ConfirmCodeModal = ({
  setUser,
  isOpen,
  onClose,
  onOpen,
  toastProps,
  setToastProps,
}) => {
  const [pin, setPin] = useState("");

  const handleVerifyClick = async () => {
    try {
      const unconfirmedUser = localStorage.getItem("unconfirmedUser");

      if (!unconfirmedUser) {
        setToastProps({
          title: "No pending user found",
          description: "Try signing up again",
          status: "error",
        });
        onClose();
        return;
      }

      const response = await confirmUserCode(unconfirmedUser, pin);
      if (response.success) {
        await axios.get("/api/syncUsers");
        localStorage.removeItem("unconfirmedUser");
        setToastProps({
          title: "Verification Confirmed",
          description: "You may now sign in",
          status: "success",
        });
      }
    } catch (error: any) {
      console.log(error);
      setToastProps({
        title: error.name,
        description: error.message,
        status: "error",
      });
    }
    onClose();
  };

  const handleResendCodeClick = async (event) => {
    event.preventDefault();

    const username = localStorage.getItem("unconfirmedUser");
    if (!username) {
      alert("No pending user found - try signing up again");
      return;
    }

    try {
      await Auth.resendSignUp(username);
      console.log(username);
      alert("Code resent successfully");
    } catch (err) {
      console.error("Error resending code: ", err);
    }
  };

  const handleNoAccessClick = () => {
    localStorage.removeItem("unconfirmedUser");
    setToastProps({
      title: "Cancelling Pending Signup",
      description: "You can try signing up with a different email address now",
      status: "success",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Flex
          minH={"50vh"}
          align={"center"}
          justify={"center"}
          bg={useColorModeValue(
            "linear-gradient(180deg, hsla(0, 0%, 100%, 1) 0%, hsla(205, 100%, 95%, 1) 50%, hsla(0, 0%, 100%, 1) 100%)",
            "radial-gradient(circle, hsla(0, 0%, 30%, 1) 0%, hsla(0, 0%, 15%, 1) 100%)"
          )}
          boxShadow={"lg"}
          p={8}
          borderRadius='10'
        >
          <Stack
            spacing={4}
            w={"full%"}
            maxW={"sm"}
            bg={useColorModeValue(
              "linear-gradient(180deg, hsla(0, 0%, 100%, 1) 0%, hsla(205, 100%, 95%, 1) 50%, hsla(0, 0%, 100%, 1) 100%)",
              "radial-gradient(circle, hsla(0, 0%, 30%, 1) 0%, hsla(0, 0%, 15%, 1) 100%)"
            )}
            rounded={"xl"}
            boxShadow={"lg"}
            p={6}
            my={2}
          >
            <Center>
              <Heading
                color={useColorModeValue("black", "gray.100")}
                lineHeight={1.1}
                fontSize={{ base: "2xl", md: "3xl" }}
              >
                Verify your Email
              </Heading>
            </Center>
            <Center
              fontSize={{ base: "sm", sm: "md" }}
              color={useColorModeValue("gray.800", "gray.400")}
            >
              <VStack
                spacing={2}
                align='center'
                fontSize={{ base: "sm", sm: "md" }}
              >
                <Text color={useColorModeValue("black", "gray.100")}>
                  Enter the verification code sent to your email
                </Text>
                <Link onClick={handleResendCodeClick} color='umbra.logoText'>
                  Resend Verification Code
                </Link>
              </VStack>
            </Center>
            <Center fontSize={{ base: "sm", sm: "md" }} fontWeight='bold'>
              {localStorage.getItem("unconfirmedUser")}
            </Center>
            <FormControl>
              <Center>
                <HStack>
                  <PinInput onChange={(newValue) => setPin(newValue)}>
                    <PinInputField required />
                    <PinInputField required />
                    <PinInputField required />
                    <PinInputField required />
                    <PinInputField required />
                    <PinInputField required />
                  </PinInput>
                </HStack>
              </Center>
            </FormControl>
            <Stack spacing={6}>
              <Button
                color={"white"}
                bg={"umbra.logoText"}
                _hover={{
                  bg: "umbra.deepSkyBlue",
                }}
                onClick={handleVerifyClick}
              >
                Verify
              </Button>
            </Stack>
            <Link
              fontSize='xs'
              color='umbra.logoText'
              onClick={handleNoAccessClick}
            >
              Don't have access to {localStorage.getItem("unconfirmedUser")}?
            </Link>
          </Stack>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmCodeModal;
