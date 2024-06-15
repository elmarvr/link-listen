import { middleware } from "astro:i18n";
import { sequence } from "astro:middleware";
import { intlMiddleware } from "./resume/intl";

export const onRequest = sequence(
  middleware({
    prefixDefaultLocale: false,
    redirectToDefaultLocale: true,
  }),
  intlMiddleware
);
