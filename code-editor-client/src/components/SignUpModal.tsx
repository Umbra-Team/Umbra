import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  InputRightElement,
  InputGroup,
  Image,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import logo from "../assets/logo-transparent.png";

import { signUp } from "../utils/aws-amplify-helpers";
import { useState } from "react";

const SignUpModal = ({ isOpen, onClose, onOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await signUp(email, password);
    if (response.success) {
      localStorage.setItem("unconfirmedUser", email);
    }
    alert(response.message);
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
          bg="white"
          borderRadius='10'
        >
          <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
            <ModalCloseButton color='black' />
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
              <Heading
                fontSize='lg'
                color='black'
                pr={6}
                pl={6}
                textAlign={"center"}
              >
                Sign up for an account to save code snippets to your personal
                library
              </Heading>
            </Stack>
            <Box
              rounded={"lg"}
              bg="white"
              boxShadow={"lg"}
              p={8}
            >
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <FormControl id='email' isRequired>
                    <FormLabel color='black'>Email address</FormLabel>
                    <Input
                      border="1px solid lightgray"
                      bg="white"
                      type='email'
                      onChange={(e) => setEmail(e.target.value)}
                      _hover={{
                        borderColor: "umbra.midnightGreen",
                      }}
                    />
                  </FormControl>
                  <FormControl id='password' isRequired>
                    <FormLabel color='black'>Password</FormLabel>
                    <InputGroup>
                      <Input
                        border="1px solid lightgray"
                        bg="white"
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => setPassword(e.target.value)}
                        _hover={{
                          borderColor: "umbra.midnightGreen",
                        }}
                      />
                      <InputRightElement h={"full"}>
                        <Button
                          variant={"ghost"}
                          color={"gray.400"}
                          onClick={() =>
                            setShowPassword((showPassword) => !showPassword)
                          }
                        >
                          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <Stack spacing={10} pt={2}>
                    <Button
                      type='submit'
                      loadingText='Submitting'
                      size='lg'
                      bg={"blue.400"}
                      color={"white"}
                      _hover={{
                        bg: "umbra.deepSkyBlue",
                      }}
                    >
                      Sign up
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Box>
          </Stack>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default SignUpModal;
