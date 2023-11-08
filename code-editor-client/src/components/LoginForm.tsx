import {
  Box,
  Stack,
  Heading,
  FormControl,
  Input,
  Image,
  FormLabel,
  Text,
  Button,
  Link,
} from "@chakra-ui/react";

import { signIn } from "../utils/aws-amplify-helpers";
import logo from "../assets/logo-transparent.png";

// Input validation related imports
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const LoginForm = ({
  setToastProps,
  setUser,
  setIsResettingPassword,
  setShowEmailReset,
  onClose,
}) => {
  // define yup input validation schema
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

  const onSubmit = async (data) => {
    try {
      const response = await signIn(setUser, data.email, data.password);
      if (response.success) {
        setToastProps({
          title: "Sign in successful!",
          description: `${data.email} is now logged in`,
          status: "success",
        });
      }
      localStorage.removeItem("unconfirmedUser");
      onClose();
    } catch (error: any) {
      setToastProps({
        title: "Sign in failed",
        description: error.message,
        status: "error",
      });
      onClose();
    }
  };

  const handleForgotPassword = () => {
    setShowEmailReset(true);
  };

  return (
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box rounded={"lg"} bg={"white"} boxShadow={"lg"} p={8}>
          <Stack spacing={4}>
            <FormControl id='email' isRequired>
              <FormLabel color='black'>Email address</FormLabel>
              <Input
                border='1px solid lightgray'
                bg='white'
                type='email'
                {...register("email")}
                _hover={{
                  borderColor: "umbra.midnightGreen",
                }}
              />
              {errors.email && (
                <Text color='red.500'>{errors.email.message}</Text>
              )}
            </FormControl>
            <FormControl id='password' isRequired>
              <FormLabel color='black'>Password</FormLabel>
              <Input
                border='1px solid lightgray'
                bg='white'
                type='password'
                {...register("password")}
                _hover={{
                  borderColor: "umbra.midnightGreen",
                }}
              />
              {errors.password && (
                <Text color='red.500'>{errors.password.message}</Text>
              )}
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Link color={"blue.400"} onClick={handleForgotPassword}>
                  Forgot password?
                </Link>
              </Stack>
              <Button
                type='submit'
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
      </form>
    </Stack>
  );
};

export default LoginForm;
