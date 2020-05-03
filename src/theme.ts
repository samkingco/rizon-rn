export const theme = {
  fonts: {
    normal: "Inter-Regular",
    bold: "Inter-Bold",
  },
  fontSizes: {
    m: 14,
    l: 20,
  },
  colors: {
    background: {
      black: "#151719",
      white: "#FFFFFF",
      accent: "#FF4700",
    },
    text: {
      default: "#FFFFFF",
      subtle: "rgba(255, 255, 255, 0.64)",
      accent: "#FF4700",
    },
    icon: {
      default: "rgba(255, 255, 255, 0.48)",
      accent: "#FF4700",
    },
  },
};

export type Theme = typeof theme;
