import { useEffect, useState, createContext } from "react";
import ReactDOM from "react-dom/client";
import {
  ChakraProvider,
  ColorModeScript,
  Alert,
  AlertTitle,
} from "@chakra-ui/react";
import { theme } from "./theme";
import App from "./App";
import axios from "axios";
import { HocuspocusProvider } from "@hocuspocus/provider";

import "./utils/aws-config";
import { Auth } from "aws-amplify";
import { Snippet } from "./types/types";
import createRandomRoomName from "./utils/createRoomName";
const EXPRESS_SERVER_ENDPOINT = "/api";

// context for hocus pocus provider
export const HocuspocusContext = createContext<HocuspocusProvider | null>(null);

const AppWrapper = () => {
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
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

  // YSweeant
  // useEffect(() => {
  //   const fetchClientToken = async (doc: string) => {
  //     const response = await axios.get(
  //       `${EXPRESS_SERVER_ENDPOINT}/get-token/${doc}`
  //     );
  //     setYSweetClientToken(response.data.clientToken);
  //   };

  //   const params = new URLSearchParams(window.location.search);
  //   const doc = params.get("doc") || "default";
  //   fetchClientToken(doc || "default");
  // }, []);

  // if (!YSweetClientToken) {
  //   return null;
  // }

  if (loading) {
    return <div>Loading...</div>; // or your preferred loading indicator
  }

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      {/* <YDocProvider clientToken={YSweetClientToken} setQueryParam='doc'> */}
      {/* {user ? (
          <Alert
            h="5px"
            bg="#D9FFD1"
            color="#288215"
            status='success'
            justifyContent={"center"}
          >
            <AlertTitle>Logged in as {user.attributes.email}</AlertTitle>
          </Alert>
        ) : (
          <Alert
            h="5px"
            bg="#FDECE3"
            color="#F58A51"
            justifyContent={"center"}
            status='info'
          >
            <AlertTitle>Not logged in</AlertTitle>
          </Alert>
        )} */}
      <HocuspocusContext.Provider value={provider}>
        <App user={user} setUser={setUser} />
      </HocuspocusContext.Provider>
    </ChakraProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<AppWrapper />);
