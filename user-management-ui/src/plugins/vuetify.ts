import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

const lightTheme = {
  dark: false,
  colors: {
    background: "#F8FAFC",
    surface: "#FFFFFF",

    // Brand palette (used across UI)
    primary: "#3a85edff", // purple
    secondary: "#F472B6", // pink
    accent: "#34D399", // green

    // Utility
    info: "#06B6D4",
    success: "#16A34A",
    warning: "#F59E0B",
    error: "#EF4444",

    // Text + borders
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    border: "#E6E9F2",
  },
};

const darkTheme = {
  dark: true,
  colors: {
    background: "#020617",
    surface: "#0F172A",

    primary: "#60A5FA",
    secondary: "#C084FC",
    accent: "#4ADE80",

    info: "#38BDF8",
    success: "#22C55E",
    warning: "#FBBF24",
    error: "#F87171",

    textPrimary: "#E5E7EB",
    textSecondary: "#94A3B8",
    border: "#1E293B",
  },
};

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "lightTheme",
    themes: {
      lightTheme,
      darkTheme,
    },
  },

  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },

  defaults: {
    VBtn: {
      rounded: "lg",
      elevation: 0,
      style: "text-transform:none;font-weight:600;",
    },
    VCard: {
      rounded: "xl",
      elevation: 2,
    },
    VTextField: {
      variant: "outlined",
      density: "comfortable",
    },
    VSelect: {
      variant: "outlined",
      density: "comfortable",
    },
    VDataTable: {
      density: "comfortable",
    },
    VChip: {
      rounded: "lg",
      label: true,
    },
    VNavigationDrawer: {
      elevation: 1,
      width: 260,
      style: "border-right:1px solid rgba(0,0,0,0.04);",
    },
    VAppBar: {
      elevation: 0,
    },
    VList: {
      density: "comfortable",
    },
    VListItem: {
      rounded: "lg",
      density: "comfortable",
      variant: "text",
    },
    VListItemTitle: {
      class: "font-weight-medium",
    },
    VListItemSubtitle: {
      class: "text--secondary",
    },
    VAvatar: {
      size: 40,
    },
    VIcon: {
      size: 20,
    },
  },
});

