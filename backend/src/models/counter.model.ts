import mongoose, { Schema } from "mongoose";

/**
 * A single counters collection backs the numeric auto-increment `id` fields.
 *
 * The original PostgreSQL schema used `serial` primary keys (1, 2, 3, …) and the
 * React frontend relies on those numeric ids for admin PATCH/DELETE calls. To keep
 * the API responses byte-for-byte compatible without touching the frontend, each
 * document carries a numeric `id` assigned from here via getNextSequence().
 */
interface CounterDoc {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<CounterDoc>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model<CounterDoc>("Counter", counterSchema);

/** Atomically increment and return the next sequence value for the given name. */
export async function getNextSequence(name: string): Promise<number> {
  const result = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  ).lean();

  return result!.seq;
}
