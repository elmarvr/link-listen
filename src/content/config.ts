import { z, defineCollection, reference } from "astro:content";

export const dateRange = z
  .tuple([z.string(), z.string()])
  .transform(([start, end]) => {
    return [new Date(start), end === "present" ? "present" : new Date(end)] as [
      Date,
      Date | "present"
    ];
  });

export type DateRange = z.infer<typeof dateRange>;

const experience = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    company: z.string().optional(),
    icon: z.string(),
    range: dateRange,
    stack: reference("stack").array(),
  }),
});

const stack = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    color: z.string(),
  }),
});

const education = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    institution: z.string(),
    range: dateRange,
  }),
});

const course = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    url: z.string(),
  }),
});

export const collections = {
  experience,
  stack,
  education,
  course,
};
