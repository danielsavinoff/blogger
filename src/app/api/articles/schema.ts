import { z } from "zod"

export const schema = z
  .object({
    title: z.string().min(1).optional(),
    slug: z
      .string()
      .min(1)
      .toLowerCase()
      .refine(
        (value) => !value.includes("/"),
        "Slug must not contain a slash character",
      )
      .optional(),
    isPublic: z.boolean().optional(),
    /** Blob up to 10 MB in Base64 string */
    preview: z.string().optional() 
  })