export const theme = {
  fonts: {
    normal: "Inter-Regular",
    bold: "Inter-Bold",
  },
  fontSizes: {
    m: 16,
    l: 24,
  },
  colors: {
    background: {
      black: "#151719",
      white: "#FFFFFF",
      goldenHour: "#FF4700",
      twilight: "#3C5064",
    },
    text: {
      default: "#FFFFFF",
      subtle: "rgba(255, 255, 255, 0.64)",
      goldenHour: "#FF4700",
    },
    clock: {
      background: "rgba(255, 255, 255, 0.16)",
      daylight: "#FFFFFF",
      goldenHour: "#FF4700",
      twilight: "#5C7A99",
    },
    icon: {
      default: "rgba(255, 255, 255, 0.48)",
      accent: "#FF4700",
    },
  },
};

export type Theme = typeof theme;
