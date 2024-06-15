import * as React from "react";
import { Document, Page } from "@react-pdf/renderer";

import { Text, View, Link } from "./ui/theme";

import type { FormatDateOptions, IntlShape } from "@formatjs/intl";
import { Prose } from "./ui/prose";
import type { Experience, Education, Course } from "../pages/[locale]/resume";
import { icons } from "./ui/icon";
import type { DateRange } from "../content/config";

export const Resume = ({
  intl,
  experience,
  education,
  courses,
}: {
  intl: IntlShape<string>;
  experience: Experience[];
  education: Education[];
  courses: Course[];
}) => {
  const next = intl.locale === "en" ? "nl" : "en";

  return (
    <Document>
      <IntlProvider intl={intl}>
        <Page>
          <Link src={`http://localhost:4321/${next}/resume`}>
            {next.toUpperCase()}
          </Link>

          <Text>
            Rotterdam, {intl.formatDisplayName("NL", { type: "region" })}
          </Text>

          {experience.map((entry) => (
            <Experience key={entry.id} experience={entry} />
          ))}

          <View className="gap-3">
            {education.map((entry) => (
              <View key={entry.id}>
                <Text>
                  {entry.title} - {entry.institution}
                </Text>
                <Text>
                  (
                  <DateRange
                    range={entry.range}
                    year="numeric"
                    suffix={false}
                  />
                  )
                </Text>

                <Prose>{entry.body}</Prose>
              </View>
            ))}
          </View>

          <View className="gap-3">
            {courses.map((course) => (
              <View key={course.id} className="flex-row items-center gap-2">
                <View className="w-2 h-2 border border-neutral-900 rounded-full mt-1" />
                <Link className="leading-none" src={course.url}>
                  {course.title}
                </Link>
              </View>
            ))}
          </View>
        </Page>
      </IntlProvider>
    </Document>
  );
};

export interface ExperienceProps {
  experience: Experience;
}
const Experience = ({ experience: exp }: ExperienceProps) => {
  return (
    <View>
      <View>
        <Text>{exp.title}</Text>
        <Text>{exp.company}</Text>
        <DateRange range={exp.range} year="numeric" month="short" />
      </View>
      <Text> </Text>
      <Prose>{exp.body}</Prose>
      <Text> </Text>
      <View className="flex-row gap-3">
        {exp.stack.map((entry) => (
          <StackEntry key={entry.id} entry={entry} />
        ))}
      </View>
    </View>
  );
};

interface DateRangeProps extends FormatDateOptions {
  range: DateRange;
  suffix?: boolean;
}
const DateRange = ({ range, suffix = true, ...opts }: DateRangeProps) => {
  const intl = React.useContext(IntlContext)!;

  const formattedRange = React.useMemo(() => {
    return range
      .map((date) => {
        if (date === "present") {
          return intl.formatMessage({ id: "experience.present" });
        }

        return intl.formatDate(date, opts);
      })
      .join(" - ");
  }, [intl, range]);

  const count = monthsBetween(range[0], range[1]);

  return (
    <Text>
      {formattedRange}
      {suffix
        ? ` (${intl.formatMessage({ id: "experience.months" }, { count })})`
        : null}
    </Text>
  );
};

function monthsBetween(start: Date, end: Date | "present") {
  if (end === "present") {
    end = new Date();
  }

  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    end.getMonth() -
    start.getMonth()
  );
}

export interface StackEntryProps {
  entry: Experience["stack"][number];
}
export const StackEntry = ({ entry }: StackEntryProps) => {
  const Icon = icons[entry.id];

  return (
    <View className="py-0.5 px-2 flex-row items-center gap-1.5 border border-neutral-900 rounded-md">
      <Icon color={entry.color} size={12} />
      <Text className="leading-none text-sm">{entry.title}</Text>
    </View>
  );
};

const IntlContext = React.createContext<IntlShape<string> | null>(null);

export interface IntlProviderProps {
  intl: IntlShape<string>;
  children: React.ReactNode;
}

export const IntlProvider = ({ intl, children }: IntlProviderProps) => {
  return <IntlContext.Provider value={intl}>{children}</IntlContext.Provider>;
};
