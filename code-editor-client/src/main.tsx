import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import App from "./App";
import axios from "axios";
import { YDocProvider } from "@y-sweet/react";

import './utils/aws-config'
import { Auth } from "aws-amplify";
import { snippets } from "@codemirror/lang-javascript";
import { Snippet } from "./types/types"

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
  const [clientToken, setClientToken] = useState(null);

  // AWS Amplify
  const [user, setUser] = useState<any>(null);
  const [userSnippets, setUserSnippets] = useState<Snippet[]>([]);


  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        Auth.currentSession()
        .then(session => {
          console.log(user);
          console.log(session.getIdToken().getJwtToken());
          setUser(user);
        })
        .catch(err => console.log(err));
      })
      .catch(() => setUser(null));
      }, []);

  useEffect(() => {
    if (user) {
      const loadClientLibrary = async () => {
        try {
          const response = await axios.get(
            `${EXPRESS_SERVER_ENDPOINT}/users/files`,
            {
              headers: {
                'Authorization': `Bearer ${user.signInUserSession.accessToken.jwtToken}`
              }
            }
          );
          console.log(`User snippets response: ${JSON.stringify(response)}`)
          setUserSnippets(response.data as Snippet[]);
        }
        catch (err) {
          console.log(err);
        }
      }
      loadClientLibrary();
    }
  }, [user]);
  
  // YSweet
  useEffect(() => {
    const fetchClientToken = async (doc: string) => {
      const response = await axios.get(
        `${EXPRESS_SERVER_ENDPOINT}/get-token/${doc}`
      );
      setClientToken(response.data.clientToken);
    };

    const params = new URLSearchParams(window.location.search);
    const doc = params.get("doc") || "default";
    fetchClientToken(doc || "default");
  }, []);

  if (!clientToken) {
    return null;
  }

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <YDocProvider clientToken={clientToken} setQueryParam='doc'>
        {user ? <div>Logged in as {user.username}</div> : <div>Not logged in</div>}
        {userSnippets ? 
          <div>
            {JSON.stringify(userSnippets)}
            <ul>
              {userSnippets.map((snippet: Snippet) => (
                <li key={snippet.id}>{snippet.name} | {snippet.content}</li>
              ))}
            </ul>
          </div> 
          : null}
        <App clientToken={clientToken} />
      </YDocProvider>
    </ChakraProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<AppWrapper />);
