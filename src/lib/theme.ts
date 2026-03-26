type ThemeColorKey = "peach" | "yellow" | "blue" | "green";

type Theme = {
  shellBase: Record<ThemeColorKey, string>;
  peach: string;
  peachDark: string;
  yellow: string;
  blue: string;
  blueDark: string;
  green: string;
  greenDark: string;
  olive: string;
  oliveSoft: string;
  border: string;
  bg: string;
  panel: string;
  panelSoft: string;
};

export const STORAGE_KEY_PAGE_COLOR = "nu4p_page_color";

export const NOVA_THEME: Theme = {
  shellBase: {
    peach: "linear-gradient(135deg, #E3A17B 0%, #E7B091 50%, #F0C1A8 100%)",
    yellow: "linear-gradient(135deg, #F0CB62 0%, #F3D57F 50%, #F7E3A6 100%)",
    blue: "linear-gradient(135deg, #94CDD0 0%, #A7D7DA 50%, #BFE4E6 100%)",
    green: "linear-gradient(135deg, #B9C88E 0%, #C7D5A6 50%, #D7E2BE 100%)",
  },
  peach: "#E3A17B",
  peachDark: "#D18E68",
  yellow: "#F0CB62",
  blue: "#94CDD0",
  blueDark: "#6FAFB3",
  green: "#B9C88E",
  greenDark: "#7FA16A",
  olive: "#7E8D55",
  oliveSoft: "#A9AE78",
  border: "#E4DEC0",
  bg: "#F5F1E3",
  panel: "#FFFFFF",
  panelSoft: "#FBF8EE",
};
