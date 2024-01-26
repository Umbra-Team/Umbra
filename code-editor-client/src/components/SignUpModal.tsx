import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
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
import { Auth } from "aws-amplify";

// Input validation related imports
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const SignUpModal = ({
  isOpen,
  onClose,
  onOpen,
  toastProps,
  setToastProps,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // using useForm with yup defined schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSignupSubmit = async (data) => {
    try {
      const response = await signUp(data.email, data.password);
      if (response.success) {
        localStorage.setItem("unconfirmedUser", data.email);
        setToastProps({
          title: "Signup Submitted Successfully",
          description: "Check your email for a verification code",
          status: "success",
        });
      }
    } catch (error: any) {
      console.log(Object.keys(error));
      if (error.code === "UsernameExistsException") {
        setToastProps({
          title: "Account email already exists",
          description: `Sending new verification code to ${data.email}`,
          status: "error",
        });
        try {
          localStorage.setItem("unconfirmedUser", data.email);
          await Auth.resendSignUp(data.email);
        } catch (error: any) {
          setToastProps({
            title: "Error resending verification code to email",
            description: error.message,
            status: "error",
          });
        }
      } else {
        setToastProps({
          title: "Error Submitting Signup",
          description: error.message,
          status: "error",
        });
      }
    }
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
          borderRadius='10'
        >
          <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
            <ModalCloseButton color={useColorModeValue("black", "white")} />
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
                color={useColorModeValue("black", "gray.100")}
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
              bg={useColorModeValue(
                "linear-gradient(180deg, hsla(0, 0%, 100%, 1) 0%, hsla(205, 100%, 95%, 1) 50%, hsla(0, 0%, 100%, 1) 100%)",
                "radial-gradient(circle, hsla(0, 0%, 30%, 1) 0%, hsla(0, 0%, 15%, 1) 100%)"
              )}
              boxShadow={"lg"}
              p={8}
            >
              <form onSubmit={handleSubmit(handleSignupSubmit)}>
                <Stack spacing={4}>
                  <FormControl id='email' isRequired>
                    <FormLabel color={useColorModeValue("black", "white")}>
                      Email address
                    </FormLabel>
                    <Input
                      border='1px solid lightgray'
                      bg='white'
                      color='black'
                      type='email'
                      {...register("email")}
                      onChange={(e) => setEmail(e.target.value)}
                      _hover={{
                        borderColor: "umbra.midnightGreen",
                      }}
                    />
                  </FormControl>
                  <FormControl id='password' isRequired>
                    <FormLabel color={useColorModeValue("black", "white")}>
                      Password
                    </FormLabel>
                    <InputGroup>
                      <Input
                        color='black'
                        border='1px solid lightgray'
                        bg='white'
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
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
                      bg={"umbra.logoText"}
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
