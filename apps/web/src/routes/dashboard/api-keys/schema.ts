import { z } from "zod";

export const formSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters.")
		.max(50, "Name must be 50 characters or less."),
});

export type FormSchema = typeof formSchema;
