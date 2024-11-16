import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./services/ApolloClient";
import MainComponent from "./components/MainComponent";
import { IntlProvider } from "react-intl";

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <IntlProvider locale="en" defaultLocale="en">
        <MainComponent />
      </IntlProvider>
    </ApolloProvider>
  );
};

export default App;
