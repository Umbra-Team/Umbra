import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Center,
  HStack,
  PinInput,
  PinInputField,
  AlertDescription,
} from "@chakra-ui/react";

import { confirmUserCode } from "../utils/aws-amplify-helpers";
import { useState } from "react";

const ConfirmCodeModal = ({
  unconfirmedUser,
  setUnconfirmedUser,
  setUser,
  isOpen,
  onClose,
  onOpen,
}) => {
  const [pin, setPin] = useState("");

  const handleVerifyClick = async () => {
    const response = await confirmUserCode(unconfirmedUser, pin);
    if (response.success) {
      setUser(setUnconfirmedUser);
      setUnconfirmedUser("");
    }
    alert(response.message);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Flex
          minH={"100vh"}
          align={"center"}
          justify={"center"}
          bg={useColorModeValue("gray.50", "gray.800")}
        >
          <Stack
            spacing={4}
            w={"full"}
            maxW={"sm"}
            bg={useColorModeValue("white", "gray.700")}
            rounded={"xl"}
            boxShadow={"lg"}
            p={6}
            my={10}
          >
            <Center>
              <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
                Verify your Email
              </Heading>
            </Center>
            <Center
              fontSize={{ base: "sm", sm: "md" }}
              color={useColorModeValue("gray.800", "gray.400")}
            >
              Enter the verification code sent to your email
            </Center>
            <Center
              fontSize={{ base: "sm", sm: "md" }}
              fontWeight='bold'
              color={useColorModeValue("gray.800", "gray.400")}
            >
              username@mail.com
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
