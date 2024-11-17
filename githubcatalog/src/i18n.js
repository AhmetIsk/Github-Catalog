import { createIntl, createIntlCache, IntlProvider } from 'react-intl';
import enMessages from './translations/en.json';
import deMessages from './translations/de.json';

const messages = {
  en: enMessages,
  de: deMessages,
};

export const defaultLocale = 'en';

export const getIntl = (locale = defaultLocale) => {
  const cache = createIntlCache();
  return createIntl({
    locale,
    messages: messages[locale],
  }, cache);
};

export const IntlWrapper = ({ children, locale }) => {
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </IntlProvider>
  );
};
