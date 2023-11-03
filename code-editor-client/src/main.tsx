import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { theme } from './theme';
import App from "./App";
import axios from "axios";
import { YDocProvider } from "@y-sweet/react";

import "./utils/aws-config";
import { Auth } from "aws-amplify";
import { Snippet } from "./types/types";


const EXPRESS_SERVER_ENDPOINT = "/api";

const AppWrapper = () => {
  // Y-Sweet token
  const [YSweetClientToken, setYSweetClientToken] = useState(null);

  // AWS Amplify
  const [user, setUser] = useState<any>(null);
  // const [cognitoClientToken, setCognitoClientToken] = useState<string>("");

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setUser(user);
        // setCognitoClientToken(user.signInUserSession.accessToken.jwtToken);
        console.log(`AUTHENTICATED USER: ${JSON.stringify(user)}`);
        console.log(
          `AUTHENTICATED USER TOKEN: ${JSON.stringify(
            user.signInUserSession.accessToken.jwtToken
          )}`
        );
      })
      .catch(() => setUser(null));
  }, []);

  // useEffect(() => {
  //   if (user) {
  //     const loadClientLibrary = async () => {
  //       try {
  //         const snippets: Snippet[] = await getAllUserSnippets(
  //           // cognitoClientToken
  //           user.signInUserSession.accessToken.jwtToken
  //         );

  //         console.log(`User snippets response: ${JSON.stringify(snippets)}`);
  //         console.log(
  //           `This is to get rid of error with not usin userSnippets until I understand what's going on: ${userSnippets}`
  //         );
  //         setUserSnippets(snippets);
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     };
  //     loadClientLibrary();
  //   }
  // }, [user]);

  // YSweet
  useEffect(() => {
    const fetchClientToken = async (doc: string) => {
      const response = await axios.get(
        `${EXPRESS_SERVER_ENDPOINT}/get-token/${doc}`
      );
      setYSweetClientToken(response.data.clientToken);
    };

    const params = new URLSearchParams(window.location.search);
    const doc = params.get("doc") || "default";
    fetchClientToken(doc || "default");
  }, []);

  if (!YSweetClientToken) {
    return null;
  }

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <YDocProvider clientToken={YSweetClientToken} setQueryParam='doc'>
        {user ? (
          <div>Logged in as {user.username}</div>
        ) : (
          <div>Not logged in</div>
        )}
        <App
          user={user}
          setUser={setUser}
          ySweetClientToken={YSweetClientToken}
        />
      </YDocProvider>
    </ChakraProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<AppWrapper />);
