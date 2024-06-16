import * as React from "react";
import { Document } from "@react-pdf/renderer";

import { Text, View, Link, Page } from "./ui/theme";

import type { FormatDateOptions, IntlShape } from "@formatjs/intl";
import { Prose } from "./ui/prose";
import type { Experience, Education, Course } from "../pages/[locale]/resume";
import { Icon } from "./ui/icon";
import type { DateRange } from "../content/config";

export const Resume = ({
  intl,
  summary,
  experience,
  education,
  courses,
}: {
  intl: IntlShape<string>;
  summary: string;
  experience: Experience[];
  education: Education[];
  courses: Course[];
}) => {
  const next = intl.locale === "en" ? "nl" : "en";

  return (
    <Document>
      <IntlProvider intl={intl}>
        <Page style={{ padding: 16 }}>
          <Link src={`http://localhost:4321/${next}/resume`}>
            {next.toUpperCase()}
          </Link>

          <View>
            <Text>Elmar van Riet</Text>
            <Text>
              Rotterdam, {intl.formatDisplayName("NL", { type: "region" })}
            </Text>
            <View className="flex-row justify-between">
              <View className="flex-row gap-1.5 items-center">
                {/* <icons.mail /> */}
                <Text className="leading-none pb-0.5">
                  elmarapply@gmail.com
                </Text>
              </View>

              <View className="flex-row gap-1.5 items-center">
                {/* <icons.phone /> */}
                <Text className="leading-none pb-0.5">+31631277843</Text>
              </View>
            </View>
          </View>

          <Text> </Text>

          <View>
            <Text>{intl.formatMessage({ id: "summary.title" })}</Text>
            <Prose>{summary}</Prose>
          </View>

          <Text> </Text>

          <View>
            <Text>{intl.formatMessage({ id: "experience.title" })}</Text>
            <View className="gap-3">
              {experience.map((entry) => (
                <Experience key={entry.id} experience={entry} />
              ))}
            </View>
          </View>

          <Text> </Text>

          <View>
            <Text>{intl.formatMessage({ id: "education.title" })}</Text>
            <View className="gap-3">
              {education.map((entry) => (
                <Education key={entry.id} education={entry} />
              ))}
            </View>
          </View>
        </Page>

        <Page style={{ padding: 16 }}>
          <View>
            <Text>{intl.formatMessage({ id: "courses.title" })}</Text>
            <View className="gap-3">
              {courses.map((course) => (
                <Course key={course.id} course={course} />
              ))}
            </View>
          </View>
        </Page>
      </IntlProvider>
    </Document>
  );
};

const Experience = ({ experience: exp }: { experience: Experience }) => {
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
          <StackEntry key={entry.title} entry={entry} />
        ))}
      </View>
    </View>
  );
};

const Education = ({ education: ed }: { education: Education }) => {
  return (
    <View>
      <Text>
        {ed.title} - {ed.institution}
      </Text>
      <Text>
        (<DateRange range={ed.range} year="numeric" suffix={false} />)
      </Text>
      <Prose>{ed.body}</Prose>
    </View>
  );
};

const Course = ({ course }: { course: Course }) => {
  return (
    <View className="flex-row items-center gap-2">
      <View className="w-2 h-2 border border-neutral-900 rounded-full mt-1" />
      <Link className="leading-none" src={course.url}>
        {course.title}
      </Link>
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

  const { months, years } = monthsAndYearsBetween(range[0], range[1]);

  const message = React.useMemo(() => {
    return intl.formatList(
      [
        years > 0 && intl.formatMessage({ id: "experience.years" }, { years }),
        months > 0 &&
          intl.formatMessage({ id: "experience.months" }, { months }),
      ].filter(Boolean) as string[]
    );
  }, [months, years]);

  return (
    <Text>
      {formattedRange}
      {suffix ? ` (${message})` : null}
    </Text>
  );
};

function monthsAndYearsBetween(start: Date, end: Date | "present") {
  if (end === "present") {
    end = new Date();
  }

  const years =
    (end.getFullYear() - start.getFullYear()) * 12 +
    end.getMonth() -
    start.getMonth();

  return {
    years: Math.floor(years / 12),
    months: years % 12,
  };
}

export interface StackEntryProps {
  entry: Experience["stack"][number];
}
export const StackEntry = ({ entry }: StackEntryProps) => {
  return (
    <View className="py-0.5 px-2 flex-row items-center gap-1.5 border border-neutral-900 rounded-md">
      <Icon icon={entry.icon} size={12} />
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
