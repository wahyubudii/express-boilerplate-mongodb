import logger from "../config/logger.js";
import Role, { RolesEnum } from "../models/role.model.js"

export const seedRoles = async () => {
  try {
    const existingRoles = await Role.find();
    if (existingRoles.length === 0) {
      await Role.insertMany([
        { name: RolesEnum.USER },
        { name: RolesEnum.ADMIN },
        { name: RolesEnum.MODERATOR },
      ]);
      logger.info("✅ Roles seeded successfully!");
    } else {
      logger.info("ℹ️ Roles already exist, skipping seeding.");
    }
  } catch (error) {
    logger.error("❌ Error seeding roles:", error);
  }
};