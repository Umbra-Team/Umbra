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
  ModalCloseButton,
  Image,
} from "@chakra-ui/react";
import logo from "../assets/logo-transparent.png";

import { signIn } from "../utils/aws-amplify-helpers";
import { useState } from "react";

const LoginModal = ({ isOpen, onClose, onOpen, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignInClick = async () => {
    try {
      await signIn(setUser, email, password);
      localStorage.removeItem("unconfirmedUser");
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleOpenClick = () => {
    onOpen();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton color='black' />
        <Flex
          minH={"50vh"}
          align={"center"}
          justify={"center"}
          bg={useColorModeValue("gray.50", "gray.800")}
          borderRadius='10'
        >
          <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
            <Stack align={"center"}>
              <Image src={logo} boxSize={32} />
              <Heading
                fontSize={"4xl"}
                textAlign={"center"}
                fontWeight='bold'
                color='#0096FF'
              >
                Umbra
              </Heading>
              <Heading fontSize='xl' color='black' textAlign={"center"}>
                Sign in to access your code library
              </Heading>
            </Stack>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
            >
              <Stack spacing={4}>
                <FormControl id='email' isRequired>
                  <FormLabel color='black'>Email address</FormLabel>
                  <Input
                    type='email'
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl id='password' isRequired>
                  <FormLabel color='black'>Password</FormLabel>
                  <Input
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    <Checkbox color='black'>Remember me</Checkbox>
                    <Text color={"blue.400"}>Forgot password?</Text>
                  </Stack>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    onClick={handleSignInClick}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
