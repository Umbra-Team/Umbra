import { Tooltip, IconButton, useClipboard, useToast } from "@chakra-ui/react";
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
      // variant: "umbra-toast",
      colorScheme: "blue",
    });
  };
  return (
    <Tooltip
      label='Click to copy room URL to share'
      fontSize='md'
      bg="orange.200"
      color={"gray.600"}
    >
      <IconButton
        icon={<CopyIcon color="white"/>}
        ml={6}
        onClick={handleCopyClick}
        variant='solid'
        bg="linear-gradient(225deg, hsla(184, 100%, 54%, 1) 0%, hsla(210, 100%, 50%, 1) 100%)"
        aria-label='Copy room URL'
        _hover={{ bg: "linear-gradient(225deg, hsla(210, 100%, 50%, 1) 0%, hsla(184, 100%, 54%, 1) 100%)" }}
              textAlign="end"
      />
    </Tooltip>
  );
};

export default ShareRoomButton;
