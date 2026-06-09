/**
 * Shared schema options: strip Mongo internals (`_id`, `__v`) from API responses
 * so the payload shape matches the original Drizzle/Postgres responses exactly.
 * Models that expose a numeric `id` field keep it (it is a real field, not the
 * Mongoose `_id` virtual, which we disable).
 *
 * Left untyped on purpose so it is structurally assignable to each model's
 * generic `SchemaOptions<...>` without fighting the type parameter.
 */
export const jsonTransform = {
  versionKey: false as const,
  toJSON: {
    virtuals: false,
    transform(_doc: unknown, ret: Record<string, unknown>) {
      delete ret._id;
      return ret;
    },
  },
};
