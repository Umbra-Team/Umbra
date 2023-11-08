import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

export interface ToastPropsType {
  title: string;
  description: string;
  status: "info" | "warning" | "error" | "success";
  setToastProps: Function;
}

const UmbraToast = ({
  title,
  description,
  status,
  setToastProps,
}: ToastPropsType) => {
  const toast = useToast();

  useEffect(() => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
      position: "top",
      colorScheme: status === "success" ? "blue" : "red",
      onCloseComplete: () => setToastProps(null),
    });
  }, [toast, title, description, status]);

  return null;
};

export default UmbraToast;
