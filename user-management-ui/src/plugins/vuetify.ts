import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";

const lightTheme = {
  dark: false,
  colors: {
    background: "#F8FAFC",
    surface: "#FFFFFF",

    primary: "#2563EB",
    secondary: "#7C3AED",
    accent: "#22C55E",

    info: "#0EA5E9",
    success: "#16A34A",
    warning: "#F59E0B",
    error: "#DC2626",

    textPrimary: "#0F172A",
    textSecondary: "#475569",
    border: "#E2E8F0",
  },
};

// Dark Theme (Optional)
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
    // Buttons
    VBtn: {
      rounded: "lg",
      elevation: 0,
      style: "text-transform:none;font-weight:600;",
    },

    // Cards
    VCard: {
      rounded: "xl",
      elevation: 2,
    },

    // Inputs
    VTextField: {
      variant: "outlined",
      density: "comfortable",
    },
    VSelect: {
      variant: "outlined",
      density: "comfortable",
    },

    // Tables
    VDataTable: {
      density: "comfortable",
    },

    // Chips
    VChip: {
      rounded: "lg",
      label: true,
    },

    // Navigation
    VNavigationDrawer: {
      elevation: 1,
    },

    VAppBar: {
      elevation: 0,
    },
  },
});
