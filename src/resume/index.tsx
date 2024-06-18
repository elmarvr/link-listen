import * as React from "react";
import { Document } from "@react-pdf/renderer";
import type {
  FormatDateOptions,
  IntlShape,
  MessageDescriptor,
} from "@formatjs/intl";

import {
  Text,
  View,
  Link,
  Page,
  ThemeProvider,
  type ThemeName,
  useTheme,
} from "./ui/theme";
import { Icon } from "./ui/icon";
import { Prose } from "./ui/prose";

import type {
  Experience,
  Education,
  Course,
  Skill,
} from "~/pages/[locale]/resume";
import type { DateRange } from "~/content/config";
import phone from "~/icons/phone.svg?raw";
import mail from "~/icons/mail.svg?raw";
import { ThemeToggle } from "./ui/theme-toggle";

const locales = ["en", "nl"] as const;

export const Resume = ({
  intl,
  summary,
  experience,
  education,
  courses,
  skills,
  theme,
}: {
  intl: IntlShape<string>;
  summary: string;
  experience: Experience[];
  education: Education[];
  courses: Course[];
  skills: Skill[];
  theme: ThemeName;
}) => {
  return (
    <Document>
      <ThemeProvider name={theme}>
        <IntlProvider intl={intl}>
          <Page>
            <View>
              <View className="flex-row items-start justify-between pb-5">
                <View>
                  <Text className="text-xl leading-snug">Elmar van Riet</Text>
                  <Text>
                    Rotterdam,{" "}
                    {intl.formatDisplayName("NL", { type: "region" })}
                  </Text>
                </View>

                <View className="gap-3 flex-row">
                  <LanguageLinks />
                  <ThemeToggle />
                </View>
              </View>

              <View className="flex-row justify-between">
                <View className="flex-row gap-1.5 items-center">
                  <Icon svg={mail} size={12} />

                  <Link
                    src="mailto:elmarapply@gmail.com"
                    className="pt-0.5 no-underline"
                  >
                    elmarapply@gmail.com
                  </Link>
                </View>

                <View className="flex-row gap-1.5 items-center">
                  <Icon svg={phone} size={12} />
                  <Link src="tel:+31631277843" className="pt-0.5 no-underline">
                    +31631277843
                  </Link>
                </View>
              </View>
            </View>

            <Text> </Text>

            <View className="gap-8">
              <Section title="summary.title">
                <Prose>{summary}</Prose>
              </Section>

              <Section title="experience.title">
                <View className="gap-7">
                  {experience.map((entry) => (
                    <Experience key={entry.id} experience={entry} />
                  ))}
                </View>
              </Section>
            </View>
          </Page>

          <Page>
            <View className="gap-8">
              <Section title="education.title">
                <View className="gap-3">
                  {education.map((entry) => (
                    <Education key={entry.id} education={entry} />
                  ))}
                </View>
              </Section>

              <Section title="courses.title">
                <View className="gap-3">
                  {courses.map((course) => (
                    <Course key={course.id} course={course} />
                  ))}
                </View>
              </Section>

              <Section title="skills.title">
                <View className="flex-row flex-wrap items-center gap-1.5">
                  {skills.map((skill, index) => (
                    <React.Fragment key={skill.id}>
                      {index > 0 ? (
                        <View className="border border-foreground rounded-full w-4 h-1" />
                      ) : null}
                      <Text className="leading-snug" key={skill.id}>
                        {skill.title}
                      </Text>
                    </React.Fragment>
                  ))}
                </View>
              </Section>
            </View>
          </Page>
        </IntlProvider>
      </ThemeProvider>
    </Document>
  );
};

const LanguageLinks = () => {
  const intl = React.useContext(IntlContext)!;

  const links = locales
    .filter((locale) => locale !== intl.locale)
    .map((locale) => ({
      language: intl.formatDisplayName(locale, { type: "language" }),
      src: `http://localhost:4321/${locale}/resume`,
    }));

  return (
    <View className="flex-row gap-2">
      {links.map(({ language, src }) => (
        <Link key={src} src={src}>
          {language}
        </Link>
      ))}
    </View>
  );
};

const Experience = ({ experience: exp }: { experience: Experience }) => {
  return (
    <View className="gap-4">
      <View>
        <Text className="font-medium">{exp.title}</Text>
        <Text>{exp.company}</Text>
        <DateRange range={exp.range} year="numeric" month="short" />
      </View>

      <Prose>{exp.body}</Prose>

      {exp.stack.length && (
        <View className="flex-row gap-2 flex-wrap">
          {exp.stack.map((entry) => (
            <StackTag key={entry.title} entry={entry} />
          ))}
        </View>
      )}
    </View>
  );
};

const Education = ({ education: ed }: { education: Education }) => {
  return (
    <View className="gap-4">
      <View>
        <Text className="font-medium">
          {ed.title} - {ed.institution}
        </Text>
        <Text>
          (<DateRange range={ed.range} year="numeric" suffix={false} />)
        </Text>
      </View>

      {ed.body && <Prose>{ed.body}</Prose>}
    </View>
  );
};

const Course = ({ course }: { course: Course }) => {
  return (
    <View className="flex-row items-center gap-2">
      <View className="w-2 h-2 border border-foreground rounded-full" />
      <Link className="leading-snug" src={course.url}>
        {course.title}
      </Link>
    </View>
  );
};

interface SectionProps extends React.ComponentPropsWithoutRef<typeof View> {
  title: MessageDescriptor["id"];
}
const Section = React.forwardRef<React.ElementRef<typeof View>, SectionProps>(
  ({ children, title, ...props }, ref) => {
    const intl = React.useContext(IntlContext)!;

    return (
      <View ref={ref} {...props}>
        <Text className="text-lg font-bold">
          {intl.formatMessage({ id: title })}
        </Text>
        {children}
      </View>
    );
  }
);

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

export interface StackTagProps {
  entry: Experience["stack"][number];
}
export const StackTag = ({ entry }: StackTagProps) => {
  return (
    <View className="py-0.5 px-2 flex-row items-center gap-1.5 border rounded-md">
      <Icon svg={entry.icon} size={12} />
      <Text className="leading-none text-sm font-medium">{entry.title}</Text>
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
