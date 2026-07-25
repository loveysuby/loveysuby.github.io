import { ColorScheme } from "../util/theme"

export interface SurfaceTokens {
  codeBg: string
  codeTitleBg: string
  codeLineNum: string
  surface: string
  surfaceHover: string
  shadowSm: string
  shadowMd: string
}

export interface Palette {
  colors: {
    lightMode: ColorScheme
    darkMode: ColorScheme
  }
  surfaces: {
    lightMode: SurfaceTokens
    darkMode: SurfaceTokens
  }
}

const marina: Palette = {
  colors: {
    lightMode: {
      light: "#fff1e7",
      lightgray: "#eddcd0",
      gray: "#7a6a5e",
      darkgray: "#243c4c",
      dark: "#16252f",
      secondary: "#326080",
      tertiary: "#805232",
      highlight: "rgba(50, 96, 128, 0.08)",
      textHighlight: "rgba(181, 210, 230, 0.55)",
    },
    darkMode: {
      light: "#182734",
      lightgray: "#2e4553",
      gray: "#7f97a3",
      darkgray: "#acbcbf",
      dark: "#f4fcfb",
      secondary: "#79a9c9",
      tertiary: "#b5d2e6",
      highlight: "rgba(82, 137, 173, 0.15)",
      textHighlight: "rgba(181, 210, 230, 0.25)",
    },
  },
  surfaces: {
    lightMode: {
      codeBg: "#fdf6f0",
      codeTitleBg: "#f6e7dc",
      codeLineNum: "#bfa898",
      surface: "#fffaf6",
      surfaceHover: "#ffffff",
      shadowSm: "0 1px 2px rgba(36, 60, 76, 0.06)",
      shadowMd: "0 6px 24px -8px rgba(36, 60, 76, 0.2)",
    },
    darkMode: {
      codeBg: "#1e313e",
      codeTitleBg: "#243948",
      codeLineNum: "#566e7c",
      surface: "#1d2f3b",
      surfaceHover: "#223641",
      shadowSm: "0 1px 2px rgba(0, 0, 0, 0.4)",
      shadowMd: "0 6px 24px -8px rgba(0, 0, 0, 0.6)",
    },
  },
}

const amberWalnut: Palette = {
  colors: {
    lightMode: {
      light: "#faf5ef",
      lightgray: "#e5d9c9",
      gray: "#7d7168",
      darkgray: "#4a413c",
      dark: "#2b2521",
      secondary: "#8f4f28",
      tertiary: "#4a413c",
      highlight: "rgba(143, 79, 40, 0.08)",
      textHighlight: "rgba(204, 180, 153, 0.55)",
    },
    darkMode: {
      light: "#211d1a",
      lightgray: "#3a332e",
      gray: "#948a80",
      darkgray: "#d4cabf",
      dark: "#ebefee",
      secondary: "#c8906d",
      tertiary: "#ccb499",
      highlight: "rgba(200, 144, 109, 0.14)",
      textHighlight: "rgba(204, 180, 153, 0.25)",
    },
  },
  surfaces: {
    lightMode: {
      codeBg: "#f6f0e8",
      codeTitleBg: "#ece2d4",
      codeLineNum: "#bdae9c",
      surface: "#fffdfa",
      surfaceHover: "#ffffff",
      shadowSm: "0 1px 2px rgba(74, 65, 60, 0.07)",
      shadowMd: "0 6px 24px -8px rgba(74, 65, 60, 0.22)",
    },
    darkMode: {
      codeBg: "#282320",
      codeTitleBg: "#2f2925",
      codeLineNum: "#6b6058",
      surface: "#262120",
      surfaceHover: "#2b2523",
      shadowSm: "0 1px 2px rgba(0, 0, 0, 0.4)",
      shadowMd: "0 6px 24px -8px rgba(0, 0, 0, 0.6)",
    },
  },
}

const frozenMist: Palette = {
  colors: {
    lightMode: {
      light: "#faf9f2",
      lightgray: "#e2e2dd",
      gray: "#6f7068",
      darkgray: "#3c3d38",
      dark: "#212220",
      secondary: "#a4530a",
      tertiary: "#dd700b",
      highlight: "rgba(164, 83, 10, 0.08)",
      textHighlight: "rgba(252, 248, 216, 0.9)",
    },
    darkMode: {
      light: "#1c1d1a",
      lightgray: "#33352f",
      gray: "#8a8c82",
      darkgray: "#cfd0c9",
      dark: "#f5f6f0",
      secondary: "#e08a33",
      tertiary: "#adaca7",
      highlight: "rgba(224, 138, 51, 0.14)",
      textHighlight: "rgba(252, 248, 216, 0.22)",
    },
  },
  surfaces: {
    lightMode: {
      codeBg: "#f5f4ec",
      codeTitleBg: "#ebeade",
      codeLineNum: "#b4b3a6",
      surface: "#fffefa",
      surfaceHover: "#ffffff",
      shadowSm: "0 1px 2px rgba(60, 61, 56, 0.07)",
      shadowMd: "0 6px 24px -8px rgba(60, 61, 56, 0.22)",
    },
    darkMode: {
      codeBg: "#232420",
      codeTitleBg: "#2a2b26",
      codeLineNum: "#63655c",
      surface: "#212220",
      surfaceHover: "#262723",
      shadowSm: "0 1px 2px rgba(0, 0, 0, 0.4)",
      shadowMd: "0 6px 24px -8px rgba(0, 0, 0, 0.6)",
    },
  },
}

const lapisVelvet: Palette = {
  colors: {
    lightMode: {
      light: "#faf8f5",
      lightgray: "#e5e1da",
      gray: "#6b6660",
      darkgray: "#2f2c33",
      dark: "#1a1820",
      secondary: "#213885",
      tertiary: "#893172",
      highlight: "rgba(33, 56, 133, 0.08)",
      textHighlight: "rgba(236, 223, 210, 0.9)",
    },
    darkMode: {
      light: "#0f1424",
      lightgray: "#252a44",
      gray: "#8288a8",
      darkgray: "#cccacc",
      dark: "#ecdfd2",
      secondary: "#93a8e0",
      tertiary: "#c58fb4",
      highlight: "rgba(147, 168, 224, 0.13)",
      textHighlight: "rgba(236, 223, 210, 0.22)",
    },
  },
  surfaces: {
    lightMode: {
      codeBg: "#f4f1ec",
      codeTitleBg: "#eae6df",
      codeLineNum: "#b0aaa2",
      surface: "#fffefc",
      surfaceHover: "#ffffff",
      shadowSm: "0 1px 2px rgba(47, 44, 51, 0.07)",
      shadowMd: "0 6px 24px -8px rgba(47, 44, 51, 0.22)",
    },
    darkMode: {
      codeBg: "#151b30",
      codeTitleBg: "#1a2038",
      codeLineNum: "#4f5573",
      surface: "#141a2d",
      surfaceHover: "#191f36",
      shadowSm: "0 1px 2px rgba(0, 0, 0, 0.45)",
      shadowMd: "0 6px 24px -8px rgba(0, 0, 0, 0.7)",
    },
  },
}

export const palettes = { marina, amberWalnut, frozenMist, lapisVelvet }

export type PaletteName = keyof typeof palettes

export const activePaletteName: PaletteName = "marina"

export const activePalette: Palette = palettes[activePaletteName]
