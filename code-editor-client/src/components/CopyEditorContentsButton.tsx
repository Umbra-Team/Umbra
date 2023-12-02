import {
  Tooltip,
  IconButton,
  useClipboard,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

const CopyEditorContentsButton = ({ editorContents }) => {
  const { onCopy } = useClipboard(editorContents);
  const toast = useToast();

  const handleCopyClick = () => {
    onCopy();
    toast({
      title: "Editor Contents Copied to Clipboard",
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
      label='Copy Editor Contents'
      bg={useColorModeValue("yellow.200", "yellow.900")}
      color={useColorModeValue("gray.600", "white")}
    >
      <IconButton
        icon={<CopyIcon />}
        mt='2'
        mr='2'
        size='sm'
        color='white'
        onClick={handleCopyClick}
        variant='solid'
        aria-label='Copy Editor Contents'
        bg='blue.500'
        _hover={{ bg: "umbra.deepSkyBlue" }}
      />
    </Tooltip>
  );
};

export default CopyEditorContentsButton;
