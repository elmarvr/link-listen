import { createIntl, createIntlCache } from "@formatjs/intl";
import { defineMiddleware } from "astro:middleware";

import en from "~/content/lang/en.json";
import nl from "~/content/lang/nl.json";

const messages = {
  en,
  nl,
};

export type Locale = keyof typeof messages;

const cache = createIntlCache();

export const intlMiddleware = defineMiddleware(async (ctx, next) => {
  const locale = (ctx.currentLocale ?? ctx.preferredLocale) as Locale;

  const intl = createIntl(
    {
      locale,
      defaultLocale: ctx.preferredLocale,
      messages: messages[locale],
    },
    cache
  );

  ctx.locals.intl = intl;

  return await next();
});

declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: keyof (typeof messages)[Locale];
    }
    interface IntlConfig {
      locale: Locale;
    }
  }
}
