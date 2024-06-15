import Markdown from "react-markdown";
import { Text, View } from "./theme";

export interface ProseProps {
  children: string;
}
export const Prose = ({ children }: ProseProps) => {
  return (
    <View className="max-w-xl">
      <Markdown
        components={{
          div: ({ children }) => <View>{children}</View>,
          p: ({ children }) => <Text>{children}</Text>,
          ul: ({ children }) => <View>{children}</View>,
          li: ({ children }) => (
            <View>
              <Text className="">- {children}</Text>
            </View>
          ),
        }}
      >
        {children}
      </Markdown>
    </View>
  );
};
