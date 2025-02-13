import { renderToBuffer } from "@react-pdf/renderer";
import type { APIRoute } from "astro";
import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import type { Locale } from "~/resume/intl";
import type { DateRange } from "~/content/config";
import { Resume } from "~/resume";
import type { ThemeName } from "~/resume/ui/theme";

export const GET: APIRoute = async (context) => {
  const locale = context.currentLocale as Locale;
  const theme = (context.url.searchParams.get("theme") ?? "light") as ThemeName;

  const summary = await getSummary(locale);
  const experience = await getExperience(locale);
  const education = await getEducation(locale);
  const courses = await getCourses();
  const skills = await getSkills(locale);

  return new Response(
    await renderToBuffer(
      Resume({
        intl: context.locals.intl,
        theme,
        summary,
        experience,
        education,
        courses,
        skills,
      })
    )
  );

  // import file  in node

  // return new Response(data);
};

async function getSummary(locale: Locale) {
  const entry = await getEntry("summary", locale);

  return entry.body;
}

async function getExperience(locale: Locale) {
  const collection = await getCollection("experience", (entry) =>
    entry.id.startsWith(locale)
  );

  const experience = await Promise.all(
    collection.map(async (entry) => {
      const stack = await Promise.all(
        entry.data.stack?.map((entry) => getStackEntry(entry.id)) ?? []
      );

      stack.sort((a, b) => a.title.localeCompare(b.title));

      return { id: entry.id, ...entry.data, stack, body: entry.body };
    })
  );

  experience.sort((a, b) => sortByRange(a.range, b.range));

  return experience;
}

export type Experience = Awaited<ReturnType<typeof getExperience>>[number];

async function getStackEntry(id: CollectionEntry<"stack">["id"]) {
  const { data } = await getEntry("stack", id);

  return {
    id,
    ...data,
  };
}

async function getEducation(locale: Locale) {
  const collection = await getCollection("education", (entry) =>
    entry.id.startsWith(locale)
  );

  const education = await Promise.all(
    collection.map(async (entry) => {
      return { id: entry.id, ...entry.data, body: entry.body };
    })
  );

  education.sort((a, b) => sortByRange(a.range, b.range));

  return education;
}

export type Education = Awaited<ReturnType<typeof getEducation>>[number];

async function getCourses() {
  const collection = await getCollection("courses");

  collection.sort((a, b) => a.data.title.localeCompare(b.data.title));

  return collection.map((entry) => ({
    id: entry.id,
    ...entry.data,
  }));
}

export type Course = Awaited<ReturnType<typeof getCourses>>[number];

export async function getSkills(locale: Locale) {
  const collection = await getEntry("skills", locale);

  const skills = collection.data.map((entry) => ({
    id: crypto.randomUUID(),
    ...entry,
  }));

  skills.sort((a, b) => a.title.localeCompare(b.title));

  return skills;
}

export type Skill = Awaited<ReturnType<typeof getSkills>>[number];

function sortByRange(a: DateRange, b: DateRange) {
  if (a[1] === "present") return -1;
  if (b[1] === "present") return 1;
  return b[1].getTime() - a[1].getTime();
}
