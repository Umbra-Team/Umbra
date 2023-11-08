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

const PasswordResetCode = ({ onClose, toastProps, setToastProps }) => {
  const [pin, setPin] = useState("");

  const schema = yup.object().shape({
    code: yup.string().required("Verification code is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Password confirmation is required"),
  });

  const {
    register,
    handleSubmit,
    control, // Add this line
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleFormSubmit = (data) => {
    console.log(data);
  };

  return (
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
            <form onSubmit={handleSubmit(handleFormSubmit)}>
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
            </form>
          </VStack>
        </Center>
      </Stack>
    </Flex>
  );
};

export default PasswordResetCode;
