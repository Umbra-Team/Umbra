import React from 'react';
import { useState, useRef } from "react"
import audioChatConnect from "../services/audioChat"
import {
  Tooltip,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";
import { useEffect } from 'react';

import joinSoundFile from './../assets/sounds/join.mp3'
import leaveSoundFile from './../assets/sounds/leave.mp3'

// AudioChatButton component

const AudioChatButton = () => {
  const [urlacIsOn, setUrlacIsOn] = useState(false)
  const isFirstRun = useRef(true)
  const [pc, setPc] = useState()
  const [ws, setWs] = useState()
  // const [roomString, _] = useState()
  const joinSound = new Audio(joinSoundFile)
  const leaveSound = new Audio(leaveSoundFile)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    // Play sound only if it's not the first render
    if (urlacIsOn) {
      joinSound.play().catch(error => console.error("Error playing sound:", error));
    } else {
      leaveSound.play().catch(error => console.error("Error playing sound:", error));
    }
  }, [urlacIsOn]);

  const handleAudioChatToggleButton = (e) => {
    e.preventDefault()
    const url = new URL(window.location.href);
    let roomName = url.searchParams.get("room");
    
    audioChatConnect(
      urlacIsOn,
      setUrlacIsOn,
      pc,
      setPc,
      ws,
      setWs,
      roomName
    )
  }

  // Determine the icon color based on the active/inactive state
  const iconColor = urlacIsOn ? useColorModeValue("green.400", "green.500") : useColorModeValue("red.400", "red.600");
  // Define the active and inactive gradient backgrounds
  const activeGradient = 'linear-gradient(225deg, hsla(100, 100%, 52%, 1) 0%, hsla(130, 100%, 28%, 1) 100%)'; // Greenish gradient
  const activeGradientHover = 'linear-gradient(225deg, hsla(130, 100%, 28%, 1) 0%, hsla(100, 100%, 52%, 1) 100%)'; // Flip the colors
  // const inactiveGradient = 'linear-gradient(225deg, hsla(0, 100%, 60%, 1) 0%, hsla(15, 100%, 38%, 1) 100%)'; // Reddish gradient
  // const inactiveGradientHover = 'linear-gradient(225deg, hsla(15, 100%, 38%, 1) 0%, hsla(0, 100%, 60%, 1) 100%)'; // Flip the colors
  const inactiveGradient = 'linear-gradient(225deg, hsla(184, 100%, 54%, 1) 0%, hsla(210, 100%, 50%, 1) 100%)'; // Blueish gradient
  const inactiveGradientHover = 'linear-gradient(225deg, hsla(210, 100%, 50%, 1) 0%, hsla(184, 100%, 54%, 1) 100%)'; // Flip the colors

  return (
    <Tooltip
    label={urlacIsOn ? 'Click to leave voice chat' : 'Click to join voice chat'}
    fontSize='md'
    bg={useColorModeValue("orange.200", "orange.900")}
    color={useColorModeValue("gray.600", "white")}
  >
    <IconButton
      // icon={urlacIsOn ? <PhoneIcon color={iconColor} /> : <PhoneIcon color={iconColor} />}
      icon={<PhoneIcon color='white' />}
      ml={6}
      onClick={handleAudioChatToggleButton}
      variant='solid'
      bg={urlacIsOn ? activeGradient : inactiveGradient}
      aria-label={urlacIsOn ? 'Leave Voice Chat' : 'Join Voice Chat'}
      _hover={{
        bg: urlacIsOn ? activeGradientHover : inactiveGradientHover,
      }}
      textAlign='end'
    />
  </Tooltip>
  )
}


export default AudioChatButton;