import * as React from "react";
import Markdown from "react-markdown";
import { Text, View } from "./theme";

export interface ProseProps
  extends Omit<React.ComponentPropsWithoutRef<typeof View>, "children"> {
  children: string;
}
export const Prose = React.forwardRef<
  React.ElementRef<typeof View>,
  ProseProps
>(({ children, className, ...props }, ref) => {
  return (
    <View ref={ref} className={["", className]} {...props}>
      <Markdown
        components={{
          div: ({ children }) => <View>{children}</View>,
          p: ({ children }) => <Text>{children}</Text>,
          ul: ({ children }) => <View>{children}</View>,
          li: ({ children }) => (
            <View>
              <Text>- {children}</Text>
            </View>
          ),
        }}
      >
        {children}
      </Markdown>
    </View>
  );
});
