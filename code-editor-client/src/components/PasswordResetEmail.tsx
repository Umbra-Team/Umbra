import {
  Box,
  Text,
  Flex,
  Stack,
  Heading,
  FormControl,
  Input,
  Button,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";

import logo from "../assets/logo-transparent.png";
import { forgotPassword } from "../utils/aws-amplify-helpers";

// Input validation related imports
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Auth } from "aws-amplify";

const PasswordResetEmail = ({
  setShowEmailReset,
  setToastProps,
  onClose,
  setIsResettingPassword,
}) => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  // using useForm with yup defined schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await forgotPassword(data.email);
      if (response.success) {
        setToastProps({
          title: "Sending Reset Verification Code",
          description: `A password reset code is being sent to ${data.email}`,
          status: "success",
        });
        localStorage.setItem("umbraPasswordResetEmail", data.email);
        setIsResettingPassword(true);
      }
    } catch (error) {
      setToastProps({
        title: "Error Sending Verification Code",
        description: `Unable to send reset code to ${data.email}`,
        status: "error",
      });
      localStorage.removeItem("umbraPasswordResetEmail");
    }
    setShowEmailReset(false);
    onClose();
  };

  return (
    <Flex
      minH={"50vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue(
        "linear-gradient(180deg, hsla(0, 0%, 100%, 1) 0%, hsla(205, 100%, 95%, 1) 50%, hsla(0, 0%, 100%, 1) 100%)",
        "radial-gradient(circle, hsla(0, 0%, 30%, 1) 0%, hsla(0, 0%, 15%, 1) 100%)"
      )}
      borderRadius='10'
      direction={"column"}
    >
      <Image src={logo} boxSize={24} />
      <Heading
        fontSize={"4xl"}
        textAlign={"center"}
        fontWeight='bold'
        color='blue.500'
      >
        Umbra
      </Heading>
      <Stack
        bg={useColorModeValue(
          "linear-gradient(180deg, hsla(0, 0%, 100%, 1) 0%, hsla(205, 100%, 95%, 1) 50%, hsla(0, 0%, 100%, 1) 100%)",
          "radial-gradient(circle, hsla(0, 0%, 30%, 1) 0%, hsla(0, 0%, 15%, 1) 100%)"
        )}
        spacing={8}
        w={"full"}
        maxW={"sm"}
        rounded={"md"}
        boxShadow={"lg"}
        p={3}
        m={6}
      >
        <Heading
          fontSize='xl'
          color={useColorModeValue("black", "gray.100")}
          textAlign={"center"}
        >
          Forgot your password?
        </Heading>
        <Text
          fontSize={{ base: "sm", sm: "md" }}
          color={useColorModeValue("black", "white")}
        >
          If you've previously signed up, a reset code will be sent to your
          email address
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl id='email'>
            <Input
              color='black'
              placeholder='umbra-user@generic-email.com'
              _placeholder={{ color: "gray.500" }}
              type='email'
              {...register("email")}
              bg='white'
            />
          </FormControl>
          <Stack spacing={6}>
            <Button
              type='submit'
              bg={"umbra.logoText"}
              color={"white"}
              mt={2}
              _hover={{
                bg: "umbra.deepSkyBlue",
              }}
            >
              Request Reset
            </Button>
          </Stack>
        </form>
      </Stack>
    </Flex>
  );
};

export default PasswordResetEmail;
