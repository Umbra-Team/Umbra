import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import App from "./App";
import axios from "axios";
import { YDocProvider } from "@y-sweet/react";
import { CognitoContext } from "./context/cognito";

import "./utils/aws-config";
import { Auth } from "aws-amplify";
import { Snippet } from "./types/types";

import { getAllUserSnippets } from "./services/snippets";

const EXPRESS_SERVER_ENDPOINT = "/api";

const theme = extendTheme({
  colors: {
    gray: {
      100: "#1E1E1E",
      200: "#252526",
      800: "#D4D4D4",
      900: "#F8F8F8",
    },
    blue: {
      500: "#007ACC",
    },
  },
  fonts: {
    body: "Georgia, serif",
    heading: "Georgia, serif",
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

const AppWrapper = () => {
  // Y-Sweet token
  const [YSweetClientToken, setYSweetClientToken] = useState(null);

  // AWS Amplify
  const [user, setUser] = useState<any>(null);
  const [cognitoClientToken, setCognitoClientToken] = useState<string>("");
  const [userSnippets, setUserSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setUser(user);
        setCognitoClientToken(user.signInUserSession.accessToken.jwtToken);
        console.log(`AUTHENTICATED USER: ${JSON.stringify(user)}`);
        console.log(
          `AUTHENTICATED USER TOKEN: ${JSON.stringify(
            user.signInUserSession.accessToken.jwtToken
          )}`
        );
      })
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (user) {
      const loadClientLibrary = async () => {
        try {
          const snippets: Snippet[] = await getAllUserSnippets(
            cognitoClientToken
          );

          console.log(`User snippets response: ${JSON.stringify(snippets)}`);
          console.log(
            `This is to get rid of error with not usin userSnippets until I understand what's going on: ${userSnippets}`
          );
          setUserSnippets(snippets);
        } catch (err) {
          console.log(err);
        }
      };
      loadClientLibrary();
    }
  }, [user]);

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
    <CognitoContext.Provider value={cognitoClientToken}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <YDocProvider clientToken={YSweetClientToken} setQueryParam='doc'>
          {user ? (
            <div>Logged in as {user.username}</div>
          ) : (
            <div>Not logged in</div>
          )}
          <App clientToken={YSweetClientToken} />
        </YDocProvider>
      </ChakraProvider>
    </CognitoContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<AppWrapper />);
