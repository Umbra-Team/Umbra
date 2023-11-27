import { useEffect, useState, createContext } from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { theme } from "./theme";
import App from "./App";
import axios from "axios";
import { HocuspocusProvider } from "@hocuspocus/provider";

import "./utils/aws-config";
import { Auth } from "aws-amplify";
import createRandomRoomName from "./utils/createRoomName";

// context for hocus pocus provider
export const HocuspocusContext = createContext<HocuspocusProvider | null>(null);

const AppWrapper = () => {
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

  // create hocuspocus provider
  useEffect(() => {
    async function fetchAndSetProvider() {
      const response = await axios.get("/api/get-provider-url");
      const providerServerUrl = response.data;

      const newProvider = new HocuspocusProvider({
        url: providerServerUrl,
        name: roomName || "default",
      });
      setProvider(newProvider);
    }

    // set url to be room name
    const url = new URL(window.location.href);
    let roomName = url.searchParams.get("room");
    if (!roomName) {
      roomName = createRandomRoomName();
    }
    url.searchParams.set("room", roomName);
    window.history.replaceState({}, "", url.toString());

    fetchAndSetProvider();
  }, []);

  // AWS Amplify
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setUser(user);
        console.log(`AUTHENTICATED USER: ${JSON.stringify(user)}`);
        console.log(
          `AUTHENTICATED USER TOKEN: ${JSON.stringify(
            user.signInUserSession.accessToken.jwtToken
          )}`
        );
      })
      .catch(() => setUser(null));
  }, []);

  if (!provider) {
    return null;
  }

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <HocuspocusContext.Provider value={provider}>
        <App user={user} setUser={setUser} />
      </HocuspocusContext.Provider>
    </ChakraProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<AppWrapper />);
