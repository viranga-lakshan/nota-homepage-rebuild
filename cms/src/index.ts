import type { Core } from '@strapi/strapi';

/**
 * What the anonymous (Public) role is allowed to do, expressed as code.
 *
 * Strapi stores role permissions in the database, not in schema files, so
 * on a fresh database (a new Railway deploy, a teammate's local Postgres)
 * they would otherwise have to be re-clicked by hand in the admin and could
 * silently drift between environments. Applying them on boot makes the
 * deployment reproducible and keeps the rule reviewable in the diff.
 *
 * The rule that matters (CLAUDE.md §7): the public may CREATE a Submission
 * and nothing else. It must never be able to find/findOne them - that would
 * publish every address the form has ever collected to anyone who asks.
 */
const PUBLIC_PERMISSIONS = [
  'api::homepage.homepage.find',
  'api::navigation.navigation.find',
  'api::footer.footer.find',
  'api::order-popup.order-popup.find',
  'api::submission.submission.create',
] as const;

async function applyPublicPermissions(strapi: Core.Strapi): Promise<void> {
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    strapi.log.warn('[bootstrap] No public role found - skipping permission setup.');
    return;
  }

  for (const action of PUBLIC_PERMISSIONS) {
    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });

    if (!existing) {
      await strapi
        .query('plugin::users-permissions.permission')
        .create({ data: { action, role: publicRole.id } });

      strapi.log.info(`[bootstrap] Granted public permission: ${action}`);
    }
  }
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await applyPublicPermissions(strapi);
  },
};
