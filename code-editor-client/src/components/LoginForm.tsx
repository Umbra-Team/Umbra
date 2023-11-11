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
  useColorModeValue,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { signIn } from "../utils/aws-amplify-helpers";
import logo from "../assets/logo-transparent.png";

// Input validation related imports
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

const LoginForm = ({
  setToastProps,
  setUser,
  setIsResettingPassword,
  setShowEmailReset,
  onClose,
}) => {
  // helps with show/hide password toggle
  const [showPassword, setShowPassword] = useState(false);

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
          color='blue.500'
        >
          Umbra
        </Heading>
        <Heading
          fontSize='xl'
          color={useColorModeValue("black", "gray.100")}
          textAlign={"center"}
        >
          Sign in to access your code library
        </Heading>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          rounded={"lg"}
          bg={useColorModeValue(
            "linear-gradient(180deg, hsla(0, 0%, 100%, 1) 0%, hsla(205, 100%, 95%, 1) 50%, hsla(0, 0%, 100%, 1) 100%)",
            "radial-gradient(circle, hsla(0, 0%, 30%, 1) 0%, hsla(0, 0%, 15%, 1) 100%)"
          )}
          boxShadow={"lg"}
          p={8}
        >
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
                _hover={{
                  borderColor: "umbra.midnightGreen",
                }}
              />
              {errors.email && (
                <Text color='red.500'>{errors.email.message}</Text>
              )}
            </FormControl>
            <FormControl id='password' isRequired>
              <FormLabel color={useColorModeValue("black", "white")}>
                Password
              </FormLabel>
              <InputGroup>
                <Input
                  border='1px solid lightgray'
                  bg='white'
                  color='black'
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
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
                {errors.password && (
                  <Text color='red.500'>{errors.password.message}</Text>
                )}
              </InputGroup>
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
                bg={"umbra.logoText"}
                color={"white"}
                _hover={{
                  bg: "umbra.deepSkyBlue",
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
