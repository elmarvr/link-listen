import {
  Page as PDFPage,
  View as PDFView,
  Text as PDFText,
  Link as PDFLink,
} from "@react-pdf/renderer";
import * as React from "react";
import { createTw } from "react-pdf-tailwind";
import { twMerge, type ClassNameValue } from "tailwind-merge";

const tw = createTw({});

function withClassName<T extends React.ComponentType<any>>(
  Component: T,
  base?: string
) {
  const AnyComponent = Component as any;

  const TW = React.forwardRef<
    React.ComponentRef<T>,
    React.ComponentProps<T> & { className?: ClassNameValue }
  >((props, ref) => {
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

export const Page = withClassName(PDFPage, "p-4");
export const View = withClassName(PDFView);
export const Text = withClassName(PDFText, "text-base");
export const Link = withClassName(PDFLink, "text-base text-blue-500 underline");
