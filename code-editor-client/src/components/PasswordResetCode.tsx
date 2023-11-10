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
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { Auth } from "aws-amplify";

// Input validation related imports
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPassword, resetPassword } from "../utils/aws-amplify-helpers";

const PasswordResetCode = ({
  onClose,
  toastProps,
  setToastProps,
  setIsResettingPassword,
}) => {
  const [pin, setPin] = useState("");

  const schema = yup.object().shape({
    code: yup.string().required("Verification code is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .nullable()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Password confirmation is required"),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = async (data) => {
    try {
      const userEmail = localStorage.getItem("umbraPasswordResetEmail");
      if (!userEmail) {
        setToastProps({
          title: "Something went wrong resetting your password",
          description: "Start the process over from the beginning",
          status: "error",
        });
      }
      const response = await resetPassword(
        userEmail,
        data.code,
        data.confirmPassword
      );
      if (response.success) {
        setToastProps({
          title: "Password reset is successful!",
          description: `Password has been reset for ${userEmail}`,
          status: "success",
        });
        localStorage.removeItem("umbraPasswordResetEmail");
        setIsResettingPassword(false);
        onClose();
      }
    } catch (error: any) {
      setToastProps({
        title: "Unsuccessful password reset",
        description: error.message,
        status: "error",
      });
    }
  };

  const handleStartOver = () => {
    localStorage.removeItem("umbraPasswordResetEmail");
    setToastProps({
      title: "Clearing pending password reset",
      description:
        "You can start the process over again by clicking on 'Login', then 'Forgot Password'",
      status: "success",
    });
    setIsResettingPassword(false);
    onClose();
  };

  return (
    <Flex
      minH={"50vh"}
      align={"center"}
      justify={"center"}
      bg='white'
      borderRadius='10'
    >
      <Stack
        spacing={6}
        // maxW={"sm"}
        bg='white'
        rounded={"lg"}
        boxShadow={"lg"}
        p={6}
        my={2}
        border='1px'
      >
        <Heading
          color='black'
          lineHeight={1.1}
          fontSize={{ base: "2xl", md: "3xl" }}
        >
          Verify your Email
        </Heading>
        <Center
          fontSize={{ base: "sm", sm: "md" }}
          color={useColorModeValue("gray.800", "gray.400")}
        >
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <VStack
              spacing={2}
              align='center'
              fontSize={{ base: "sm", sm: "md" }}
              color={useColorModeValue("gray.800", "gray.400")}
            >
              <FormControl id='code'>
                <Controller
                  name='code'
                  control={control}
                  defaultValue=''
                  rules={{ required: "Verification code is required" }}
                  render={({ field }) => (
                    <PinInput {...field}>
                      <PinInputField required />
                      <PinInputField required />
                      <PinInputField required />
                      <PinInputField required />
                      <PinInputField required />
                      <PinInputField required />
                    </PinInput>
                  )}
                />
                {errors.code && (
                  <Text color='red.500'>{errors.code.message}</Text>
                )}
              </FormControl>
              <FormControl id='password'>
                <Input
                  placeholder='New password'
                  type='password'
                  {...register("password")}
                />
                {errors.password && (
                  <Text color='red.500'>{errors.password.message}</Text>
                )}
              </FormControl>
              <FormControl id='confirmPassword'>
                <Input
                  placeholder='Confirm password'
                  type='password'
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <Text color='red.500'>{errors.confirmPassword.message}</Text>
                )}
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
                  Verify
                </Button>
              </Stack>
              <Link color='blue' onClick={handleStartOver}>
                Click here to clear pending reset
              </Link>
            </VStack>
          </form>
        </Center>
      </Stack>
    </Flex>
  );
};

export default PasswordResetCode;
