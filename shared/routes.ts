import { z } from 'zod';
import { insertUserSchema, datasets, equipment } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// Response types
const statsResponseSchema = z.object({
  totalCount: z.number(),
  avgFlowrate: z.number(),
  avgPressure: z.number(),
  avgTemperature: z.number(),
  typeDistribution: z.record(z.string(), z.number()),
});

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.object({ id: z.number(), username: z.string() }),
        400: z.string(),
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: insertUserSchema,
      responses: {
        200: z.object({ id: z.number(), username: z.string() }),
        401: z.string(),
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    user: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.object({ id: z.number(), username: z.string() }),
        401: z.void(),
      },
    },
  },
  datasets: {
    upload: {
      method: 'POST' as const,
      path: '/api/datasets/upload',
      // Input is multipart/form-data, handled separately
      responses: {
        201: z.custom<typeof datasets.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/datasets',
      responses: {
        200: z.array(z.custom<typeof datasets.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/datasets/:id',
      responses: {
        200: z.custom<typeof datasets.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    stats: {
      method: 'GET' as const,
      path: '/api/datasets/:id/stats',
      responses: {
        200: statsResponseSchema,
        404: errorSchemas.notFound,
      },
    },
    equipment: {
      method: 'GET' as const,
      path: '/api/datasets/:id/equipment',
      responses: {
        200: z.array(z.custom<typeof equipment.$inferSelect>()),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type StatsResponse = z.infer<typeof statsResponseSchema>;
