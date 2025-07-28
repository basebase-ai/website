/**
 * Application Configuration
 *
 * Centralized configuration for app metadata, branding, and default settings.
 * Update these values to customize your BaseBase application.
 */

export const appConfig = {
  /** Application name displayed throughout the UI */
  name: "Welcome to BaseBase!",

  /** Short description for metadata and about sections */
  description: "BaseBase starter project.",

  /** Default project ID for authentication (can be overridden by users) */
  defaultProjectId: "test_project",

  /** Application URL (update for production) */
  url: "https://your-app.com",

  /** Additional metadata */
  metadata: {
    /** SEO keywords */
    keywords: ["basebase", "authentication", "starter", "nextjs", "mantine"],

    /** Author information */
    author: "Your Name",

    /** App version */
    version: "1.0.0",
  },
} as const;

/** Type-safe access to configuration values */
export type AppConfig = typeof appConfig;
