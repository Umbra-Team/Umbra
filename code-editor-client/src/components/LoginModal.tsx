import {
  Flex,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
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
        <ModalCloseButton color={useColorModeValue("black", "white")} />
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
          {content}
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
