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
} from "@chakra-ui/react";

import logo from "../assets/logo-transparent.png";
import { forgotPassword } from "../utils/aws-amplify-helpers";

// Input validation related imports
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Auth } from "aws-amplify";

const PasswordResetEmail = ({ setShowEmailReset, setToastProps, onClose }) => {
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
      }
      onClose();
    } catch (error) {
      setToastProps({
        title: "Error Sending Verification Code",
        description: `Unable to send reset code to ${data.email}`,
        status: "error",
      });
      localStorage.removeItem("umbraPasswordResetEmail");
    }
  };

  return (
    <Flex
      minH={"50vh"}
      align={"center"}
      justify={"center"}
      bg='white'
      direction={"column"}
    >
      <Image src={logo} boxSize={24} />
      <Heading color='black'>Umbra</Heading>
      <Stack
        spacing={8}
        w={"full"}
        maxW={"sm"}
        rounded={"md"}
        boxShadow={"lg"}
        p={3}
        m={6}
        border='1px'
      >
        <Heading
          color='black'
          lineHeight={1.1}
          fontSize={{ base: "2xl", md: "3xl" }}
        >
          Forgot your password?
        </Heading>
        <Text fontSize={{ base: "sm", sm: "md" }} color='black'>
          If you've previously signed up, a reset code will be sent.
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl id='email'>
            <Input
              placeholder='umbra-user@generic-email.com'
              _placeholder={{ color: "gray.500" }}
              type='email'
              {...register("email")}
              color='black'
            />
          </FormControl>
          <Stack spacing={6}>
            <Button
              type='submit'
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
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
