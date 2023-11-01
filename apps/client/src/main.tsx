import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import client from "./with-graphql/client.ts";
import { WebsocketProvider, socket } from "./context/WebSocketContext.tsx";
import { AuthProvider } from "./context/AuthProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WebsocketProvider value={socket}>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </WebsocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
