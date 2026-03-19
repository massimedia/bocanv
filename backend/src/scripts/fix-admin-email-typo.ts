/**
 * Fix admin email typo: mail@massiemdia.dk -> mail@massimedia.dk
 *
 * Run with: medusa exec ./src/scripts/fix-admin-email-typo.ts
 *
 * Requires DATABASE_URL (from Railway or .env).
 * Run locally with Railway DATABASE_URL, or run as one-off in Railway.
 */
import type { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";

const OLD_EMAIL = "mail@massiemdia.dk";
const NEW_EMAIL = "mail@massimedia.dk";

export default async function fixAdminEmailTypo({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const authModule = container.resolve(Modules.AUTH);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info(`Fixing admin email typo: ${OLD_EMAIL} -> ${NEW_EMAIL}`);

  try {
    // 1. Find provider identity via query API
    const { data: providerIdentities } = await query.graph({
      entity: "provider_identity",
      fields: ["id", "entity_id", "provider"],
      filters: { entity_id: OLD_EMAIL, provider: "emailpass" },
    });

    if (!providerIdentities?.length) {
      logger.error(
        `No provider_identity found with entity_id="${OLD_EMAIL}". ` +
          "Run the SQL manually (see below). Table names may vary."
      );
      logger.info(`
Manual SQL (run in Railway PostgreSQL):
  UPDATE "user" SET email = '${NEW_EMAIL}' WHERE email = '${OLD_EMAIL}';
  -- Then find and update auth table. List tables first:
  SELECT table_schema, table_name FROM information_schema.tables
  WHERE table_name LIKE '%provider%' OR table_name LIKE '%identity%' OR table_name LIKE '%auth%';
  -- Then update (replace TABLE_NAME with actual table name):
  UPDATE <provider_identity_table> SET entity_id = '${NEW_EMAIL}' WHERE entity_id = '${OLD_EMAIL}' AND provider = 'emailpass';
`);
      return;
    }

    for (const pi of providerIdentities) {
      await authModule.updateProviderIdentities({
        id: pi.id,
        entity_id: NEW_EMAIL,
      });
      logger.info(`Updated provider_identity ${pi.id}`);
    }

    // 2. Update user table email (UpdateUserDTO does not include email - login uses provider_identity)
    // Skip user table; provider_identity.entity_id is what auth uses.

    logger.info("Done. You can now log in with mail@massimedia.dk");
  } catch (err) {
    logger.error("Fix failed:", err);
    throw err;
  }
}
