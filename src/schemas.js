import { z } from "zod";

export const ArchitectOutputSchema = z.object({
  files: z.array(
    z.object({
      filename: z.string(),
      content: z.string(),
    })
  ),
});

export const CoderOutputSchema = z.object({
  code: z.string(),
  importantNotes: z.string(),
});

export const PlannerOutputSchema = z.object(  {
  description: z.string(),
});
