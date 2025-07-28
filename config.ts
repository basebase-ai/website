/**
 * Application Configuration
 *
 * Centralized configuration for app metadata, branding, and default settings.
 * Update these values to customize your BaseBase application.
 */

export const appConfig = {
  /** Application name displayed throughout the UI */
  name: "BaseBase",

  /** Short description for metadata and about sections */
  description:
    "A powerful new platform where communities can develop real production apps by vibe coding together, in real time.",

  /** Default project ID for authentication (can be overridden by users) */
  defaultProjectId: "basebase_platform",

  /** Application URL (update for production) */
  url: "https://basebase.ai",

  /** Additional metadata */
  metadata: {
    /** SEO keywords */
    keywords: [
      "basebase",
      "collaborative coding",
      "real-time development",
      "community apps",
      "vibe coding",
      "nextjs",
      "mantine",
    ],

    /** Author information */
    author: "BaseBase Team",

    /** App version */
    version: "1.0.0",
  },
} as const;

/** Type-safe access to configuration values */
export type AppConfig = typeof appConfig;
