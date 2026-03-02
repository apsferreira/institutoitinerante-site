import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('IIT'),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    lang: z.enum(['pt', 'en']).default('pt'),
  }),
});

export const collections = { blog };
