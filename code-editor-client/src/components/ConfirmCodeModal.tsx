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
    const unconfirmedUser = localStorage.getItem("unconfirmedUser");
    if (!unconfirmedUser) {
      alert("No pending user found - try signing up again");
      localStorage.removeItem("unconfirmedUser");
      return;
    }

    const response = await confirmUserCode(unconfirmedUser, pin);
    if (response.success) {
      await axios.get("/api/syncUsers");
      localStorage.removeItem("unconfirmedUser");
    }
    alert(response.message);
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Flex
          minH={"50vh"}
          align={"center"}
          justify={"center"}
          bg={useColorModeValue("gray.50", "gray.800")}
          borderRadius='10'
        >
          <Stack
            spacing={4}
            w={"full%"}
            maxW={"sm"}
            bg={useColorModeValue("white", "gray.700")}
            rounded={"xl"}
            boxShadow={"lg"}
            p={6}
            my={2}
          >
            <Center>
              <Heading
                color='black'
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
                color={useColorModeValue("gray.800", "gray.400")}
              >
                <Text color='black'>
                  Enter the verification code sent to your email
                </Text>
                <Link onClick={handleResendCodeClick} color='blue.500'>
                  Resend Verification Code
                </Link>
              </VStack>
            </Center>
            <Center
              fontSize={{ base: "sm", sm: "md" }}
              fontWeight='bold'
              color='black'
            >
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
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleVerifyClick}
              >
                Verify
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmCodeModal;
