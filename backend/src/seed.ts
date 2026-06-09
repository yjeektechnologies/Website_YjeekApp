import { connectDatabase } from "./config/db.js";
import { Launch } from "./models/launch.model.js";
import mongoose from "mongoose";

/**
 * Seed a sample upcoming launch (mirrors the original Drizzle seed) so the public
 * "coming soon" countdown has data to render. Run with:  npm run seed
*/

async function seed(): Promise<void> {
  await connectDatabase();

  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 60);

  await Launch.create({
    city: "Juffair",
    cityAr: "الجفير",
    country: "Bahrain",
    countryCode: "BH",
    launchDate,
    description:
      "We're bringing ultra-fast delivery to every corner of Juffair. Be the first to know when we go live.",
    descriptionAr:
      "نحن نجلب التوصيل الفائق السرعة إلى كل زاوية في الجفير. كن أول من يعلم عند انطلاقنا.",
    isActive: true,
  });

  console.log("Seeded Juffair launch:", launchDate.toISOString());
  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});