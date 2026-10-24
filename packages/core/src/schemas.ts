import { z } from 'zod';
export const reasonRequestSchema = z.object({ turn: z.object({ id: z.string(), revision: z.number(), text: z.string().max(500) }), history: z.array(z.string()).default([]), stance: z.enum(['NO', 'YES']), count: z.number().int().min(2).max(4) });
export const expandRequestSchema = z.object({ turn: z.object({ id: z.string(), revision: z.number(), text: z.string().max(500) }), history: z.array(z.string()).default([]), stance: z.enum(['NO', 'YES']), userText: z.string().max(200), source: z.enum(['initials', 'keywords', 'exact']) });
export const checkRequestSchema = z.object({ turn: z.object({ id: z.string(), revision: z.number(), text: z.string().max(500) }), stance: z.enum(['NO', 'YES']), texts: z.array(z.string()).max(3) });
