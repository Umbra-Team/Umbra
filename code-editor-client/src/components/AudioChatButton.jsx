import React from "react";
import { useState } from "react";
import audioChatConnect from "../services/audioChat";
import { Tooltip, IconButton, useColorModeValue } from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";

const AudioChatButton = () => {
  const [urlacIsOn, setUrlacIsOn] = useState(false);
  const [pc, setPc] = useState();
  const [ws, setWs] = useState();
  // const [roomString, _] = useState()

  const handleAudioChatToggleButton = (e) => {
    e.preventDefault();

    const url = new URL(window.location.href);
    let roomName = url.searchParams.get("room");

    audioChatConnect(urlacIsOn, setUrlacIsOn, pc, setPc, ws, setWs, roomName);
  };

  return urlacIsOn ? (
    <Tooltip
      label='Click to leave voice chat'
      fontSize='md'
      bg={useColorModeValue("orange.200", "orange.900")}
      color={useColorModeValue("gray.600", "white")}
    >
      <IconButton
        icon={<PhoneIcon color='white' />}
        ml={6}
        onClick={handleAudioChatToggleButton}
        variant='solid'
        bg='linear-gradient(225deg, hsla(184, 100%, 54%, 1) 0%, hsla(210, 100%, 50%, 1) 100%)'
        aria-label='Leave Voice Chat'
        _hover={{
          bg: "linear-gradient(225deg, hsla(210, 100%, 50%, 1) 0%, hsla(184, 100%, 54%, 1) 100%)",
        }}
        textAlign='end'
      />
    </Tooltip>
  ) : (
    <Tooltip
      label='Click to join voice chat'
      fontSize='md'
      bg={useColorModeValue("orange.200", "orange.900")}
      color={useColorModeValue("gray.600", "white")}
    >
      <IconButton
        icon={<PhoneIcon color='white' />}
        ml={6}
        onClick={handleAudioChatToggleButton}
        variant='solid'
        bg='linear-gradient(225deg, hsla(184, 100%, 54%, 1) 0%, hsla(210, 100%, 50%, 1) 100%)'
        aria-label='Join Voice Chat'
        _hover={{
          bg: "linear-gradient(225deg, hsla(210, 100%, 50%, 1) 0%, hsla(184, 100%, 54%, 1) 100%)",
        }}
        textAlign='end'
      />
    </Tooltip>
  );
};

export default AudioChatButton;
