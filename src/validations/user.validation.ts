import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name can not be empty" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(20, { message: "Name must be at most 20 characters" })
    .refine((value) => /^[a-zA-Z\s]+$/.test(value), {
      message: "Name must contain only letters and spaces",
    }),

  email: z
    .string({ required_error: "Email is required" })
    .email("Email is invalid")
    .min(1, { message: "Email can not be empty" })
    .refine((val) => val.trim() !== "", {
      message: "Email can not be empty",
    }),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, { message: "Password can not be empty" })
    .min(6, "Password must be at least 6 characters")
    .refine((val) => val.trim() !== "", {
      message: "Password can not be empty",
    }),
});

export default { createUserSchema };
