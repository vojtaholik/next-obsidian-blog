import { z } from 'zod'

export const PostSchema = z.object({
  slug: z.string(),
  title: z.string(),
  content: z.string(),
  path: z.array(z.string()).optional().nullable(),
  frontmatter: z
    .object({
      title: z.string().nullable().optional(),
      date: z.string().nullable().optional(),
      published: z.boolean().nullable().optional(),
    })
    .nullable()
    .optional(),
})

export type Post = z.infer<typeof PostSchema>
