/**
 * Reset admin password without email.
 *
 * Run with: ADMIN_EMAIL=mail@massimedia.dk ADMIN_NEW_PASSWORD=YourNewPassword medusa exec ./src/scripts/reset-admin-password.ts
 *
 * Or in Railway one-off: set ADMIN_EMAIL and ADMIN_NEW_PASSWORD in Variables, then run:
 *   npm run reset-admin-password
 */
import type { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";

export default async function resetAdminPassword({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const authModule = container.resolve(Modules.AUTH);

  const email = process.env.ADMIN_EMAIL || "mail@massimedia.dk";
  const newPassword = process.env.ADMIN_NEW_PASSWORD;

  if (!newPassword) {
    logger.error("Set ADMIN_NEW_PASSWORD env var with your new password.");
    process.exit(1);
  }

  logger.info(`Resetting password for ${email}...`);

  try {
    const result = await authModule.updateProvider("emailpass", {
      entity_id: email,
      password: newPassword,
    });

    if (result?.error) {
      logger.error("Failed:", result.error);
      process.exit(1);
    }

    logger.info("Password updated. You can now log in with the new password.");
  } catch (err) {
    logger.error("Reset failed:", err);
    process.exit(1);
  }
}
