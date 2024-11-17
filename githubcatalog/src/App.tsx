import React, { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./services/ApolloClient";
import MainComponent from "./components/MainComponent";
import { IntlProvider } from "react-intl";
import enMessages from "./translations/en.json";
import deMessages from "./translations/de.json";

const messages = {
  en: enMessages,
  de: deMessages,
};

const App: React.FC = () => {
  const [locale, setLocale] = useState<"en" | "de">("en");

  const handleLocaleChange = (newLocale: "en" | "de") => {
    setLocale(newLocale);
  };

  return (
    <ApolloProvider client={client}>
      <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="en">
        <MainComponent onLocaleChange={handleLocaleChange} currentLocale={locale} />
      </IntlProvider>
    </ApolloProvider>
  );
};

export default App;
