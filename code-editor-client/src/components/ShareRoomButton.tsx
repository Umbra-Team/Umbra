import {
  Tooltip,
  IconButton,
  useClipboard,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

const ShareRoomButton = () => {
  const { onCopy } = useClipboard(window.location.href);
  const toast = useToast();

  const handleCopyClick = () => {
    onCopy();
    toast({
      title: "Room URL Copied to clipboard",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
      colorScheme: "blue",
    });
  };
  return (
    <Tooltip
      label='Click to copy room URL'
      fontSize='md'
      bg={useColorModeValue("orange.200", "orange.900")}
      color={useColorModeValue("gray.600", "white")}
    >
      <IconButton
        icon={<CopyIcon color='white' />}
        ml={6}
        onClick={handleCopyClick}
        variant='solid'
        bg='linear-gradient(225deg, hsla(184, 100%, 54%, 1) 0%, hsla(210, 100%, 50%, 1) 100%)'
        aria-label='Copy room URL'
        _hover={{
          bg: "linear-gradient(225deg, hsla(210, 100%, 50%, 1) 0%, hsla(184, 100%, 54%, 1) 100%)",
        }}
        textAlign='end'
      />
    </Tooltip>
  );
};

export default ShareRoomButton;
