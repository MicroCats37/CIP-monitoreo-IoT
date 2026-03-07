import { z } from 'zod';

export const UserBaseSchema = z.object({
    id: z.number(),
    username: z.string(),
    email: z.string().email(),
    first_name: z.string(),
    last_name: z.string(),
    categorias: z.array(z.string()), // Ejemplo: ['Administrador', 'Ventas']
});
export const LoginResponseSchema = z.object({
    refresh: z.string(),
    access: z.string(),
    user: UserBaseSchema,
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

export const LoggedUserSchema = UserBaseSchema;
export type LoggedUser = z.infer<typeof LoggedUserSchema>;
