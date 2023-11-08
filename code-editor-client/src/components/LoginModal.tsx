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
  Link,
} from "@chakra-ui/react";
import LoginForm from "./LoginForm";

import { useState, useEffect } from "react";
import PasswordResetEmail from "./PasswordResetEmail";
import PasswordResetCode from "./PasswordResetCode";

const LoginModal = ({
  isOpen,
  onClose,
  onOpen,
  setUser,
  toastProps,
  setToastProps,
}) => {
  // checking to see if user is currently attempting to reset password
  const [isResettingPassword, setIsResettingPassword] = useState(
    !!localStorage.getItem("umbraPasswordResetEmail")
  );
  // const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showEmailReset, setShowEmailReset] = useState(false);

  let content;
  if (showEmailReset) {
    content = (
      <PasswordResetEmail
        setShowEmailReset={setShowEmailReset}
        setToastProps={setToastProps}
        onClose={onClose}
        setIsResettingPassword={setIsResettingPassword}
      />
    );
  } else if (isResettingPassword) {
    content = (
      <PasswordResetCode
        onClose={onClose}
        toastProps={toastProps}
        setToastProps={setToastProps}
        setIsResettingPassword={setIsResettingPassword}
      />
    );
  } else {
    content = (
      <LoginForm
        setToastProps={setToastProps}
        setUser={setUser}
        setIsResettingPassword={setIsResettingPassword}
        setShowEmailReset={setShowEmailReset}
        onClose={onClose}
      />
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setShowEmailReset(false);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton color='black' />
        <Flex
          minH={"50vh"}
          align={"center"}
          justify={"center"}
          bg={"white"}
          borderRadius='10'
        >
          {content}
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
