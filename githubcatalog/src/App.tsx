import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./services/ApolloClient";
import MainComponent from "./components/MainComponent";

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <MainComponent />
    </ApolloProvider>
  );
};

export default App;
