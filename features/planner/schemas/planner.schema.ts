
import { z } from 'zod';

export const TaskSchema = z.object({
  title: z.string()
    .min(3, 'O título deve ter no mínimo 3 caracteres')
    .max(100, 'O título é muito longo'),
  category: z.string().min(1, 'Selecione uma categoria'),
  completed: z.boolean().default(false),
});

export const GuestSchema = z.object({
  name: z.string()
    .min(2, 'Nome muito curto')
    .max(50, 'Nome muito longo'),
  status: z.enum(['Pendente', 'Confirmado', 'Recusado']),
  notified: z.boolean().default(false),
});

export type TaskInput = z.infer<typeof TaskSchema>;
export type GuestInput = z.infer<typeof GuestSchema>;
