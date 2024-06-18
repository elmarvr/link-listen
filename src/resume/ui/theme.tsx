import {
  Page as PDFPage,
  View as PDFView,
  Text as PDFText,
  Link as PDFLink,
  Font,
} from "@react-pdf/renderer";
import * as React from "react";
import { createTw } from "react-pdf-tailwind";
import { twMerge, type ClassNameValue } from "tailwind-merge";

function registerFont(family: string) {
  Font.register({
    family,
    fonts: [
      {
        src: `./src/fonts/${family}/${family}-Regular.ttf`,
      },
      {
        src: `./src/fonts/${family}/${family}-Medium.ttf`,
        fontWeight: "medium",
      },
      {
        src: `./src/fonts/${family}/${family}-Bold.ttf`,
        fontWeight: "bold",
      },
    ],
  });
}

registerFont("Inter");

const theme = {
  light: {
    colors: {
      background: "hsl(0, 0%, 100%)",
      foreground: "hsl(222.2, 84%, 4.9%)",
      border: "hsl(214.3, 31.8%, 91.4%)",
    },
  },

  dark: {
    colors: {
      background: "hsl(222.2, 84%, 4.9%)",
      foreground: "hsl(210, 40%, 98%)",
      border: "hsl(217.2, 32.6%, 17.5%)",
    },
  },
};

export type ThemeName = keyof typeof theme;
export type Theme = (typeof theme)[ThemeName];

const ThemeContext = React.createContext<{
  tw: ReturnType<typeof createTw>;
  name: ThemeName;
  theme: Theme;
} | null>(null);

export function useTheme() {
  const theme = React.useContext(ThemeContext);

  if (!theme) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return theme;
}

export const ThemeProvider = ({
  children,
  name,
}: {
  children: React.ReactNode;
  name: ThemeName;
}) => {
  const tw = React.useMemo(() => {
    return createTw(
      {
        theme: {
          fontFamily: {
            body: ["Inter"],
          },

          extend: theme[name],
        },
      },
      {
        ptPerRem: 12,
      }
    );
  }, []);

  return (
    <ThemeContext.Provider value={{ tw, theme: theme[name], name }}>
      {children}
    </ThemeContext.Provider>
  );
};

function withTheme<T extends React.ComponentType<any>>(
  Component: T,
  base?: string
) {
  const AnyComponent = Component as any;

  const TW = React.forwardRef<
    React.ComponentRef<T>,
    React.ComponentProps<T> & { className?: ClassNameValue }
  >((props, ref) => {
    const { tw } = useTheme();

    const className = twMerge(base, props.className).trim();

    return (
      <AnyComponent
        {...props}
        ref={ref}
        style={[className && tw(className), props.style]}
      />
    );
  });

  TW.displayName = Component.displayName || Component.name;

  return TW;
}

export const Page = withTheme(PDFPage, "p-8 bg-background");
export const View = withTheme(PDFView, "border-border");
export const Text = withTheme(PDFText, "text-base font-body text-foreground");
export const Link = withTheme(
  PDFLink,
  "text-base font-body text-foreground underline"
);
