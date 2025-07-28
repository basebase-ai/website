"use client";

import { createTheme } from "@mantine/core";

export const theme = createTheme({
  /** Primary color scheme - used for buttons, links, etc. */
  primaryColor: "blue",

  /** Default radius for components */
  defaultRadius: "md",

  /** Font family */
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

  /** Customize colors for better dark mode support */
  colors: {
    // You can customize colors here if needed
    // The default Mantine colors work great with auto dark mode
  },

  /** Component-specific theme overrides */
  components: {
    Paper: {
      defaultProps: {
        // Better default shadow for papers in both modes
        shadow: "sm",
      },
    },
    Button: {
      defaultProps: {
        // Better default variant
        variant: "filled",
      },
    },
    Modal: {
      defaultProps: {
        // Better default modal styling
        centered: true,
        overlayProps: { backgroundOpacity: 0.55, blur: 3 },
      },
    },
  },
});
