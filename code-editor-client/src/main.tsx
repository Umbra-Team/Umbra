import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import App from "./App";
import axios from "axios";
import { YDocProvider } from "@y-sweet/react";

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
  const [clientToken, setClientToken] = useState(null);

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
        <App clientToken={clientToken} />
      </YDocProvider>
    </ChakraProvider>
  );
};

ReactDOM.render(<AppWrapper />, document.getElementById("root"));
