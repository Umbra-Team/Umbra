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
    <Tooltip label='Click to copy room URL to share' fontSize='md'>
      <IconButton
        icon={<CopyIcon />}
        onClick={handleCopyClick}
        variant='solid'
        colorScheme='blue'
        aria-label='Copy room URL'
      />
    </Tooltip>
  );
};

export default ShareRoomButton;
