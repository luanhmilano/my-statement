import { z } from "zod";

export const createAccountSchema = z
    .object({
        lastName: z.string().min(1, "Last name is required"),
        firstName: z.string().min(1, "First name is required"),
        email: z.email('Invalid email address'),
        birthdate: z.iso.date("Invalid date format"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string().min(6, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

export type CreateAccountData = z.infer<typeof createAccountSchema>;