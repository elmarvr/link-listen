import path from "node:path";
import { readFile } from "node:fs/promises";
import { z, defineCollection, reference } from "astro:content";

export const zdateRange = z
  .tuple([z.string(), z.string()])
  .transform(([start, end]) => {
    return [new Date(start), end === "present" ? "present" : new Date(end)] as [
      Date,
      Date | "present"
    ];
  });

export type DateRange = z.infer<typeof zdateRange>;

const zicon = z.string().transform(async (value, ctx) => {
  try {
    return readFile(path.resolve("./src/icons", value), "utf-8");
  } catch (error) {
    ctx.addIssue({
      code: "custom",
      message: `Icon "${value}" not found`,
    });

    return z.NEVER;
  }
});

const zcolor = z.custom<`#${string}`>((value) => {
  return typeof value === "string" ? /^#[0-9a-f]{6}$/i.test(value) : false;
});

const experience = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    company: z.string().optional(),
    icon: z.string(),
    range: zdateRange,
    stack: reference("stack").array().optional(),
  }),
});

const education = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    institution: z.string(),
    range: zdateRange,
  }),
});

const courses = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    url: z.string(),
  }),
});

const stack = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    icon: zicon,
    color: zcolor,
  }),
});

const skills = defineCollection({
  type: "data",
  schema: z
    .object({
      title: z.string(),
    })
    .array(),
});

export const collections = {
  experience,
  stack,
  education,
  courses,
  skills,
};
