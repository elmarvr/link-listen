/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    intl: import("@formatjs/intl").IntlShape<string>;
  }
}
