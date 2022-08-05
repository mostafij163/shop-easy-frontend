import { createTheme, experimental_sx as sx } from "@mui/material";

const mainTheme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#fff",
      light: "##E6E6E6",
    },
    secondary: {
      main: "#f50057",
      light: "#ff2975",
      dark: "#d6004c",
    },
    error: {
      main: "#F85C70",
      light: "#F37970",
      dark: "#E43D40",
    },
    divider: "#F37970",
    background: {
      paper: "#fff",
      default: "#f7f9fd",
    },
  },

  shape: {
    borderRadius: "10px",
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          borderRadius: "10px",
          textTransform: "capitalize",
          fontSize: "1rem",
          fontFamily: "Montserrat",
          boxShadow: "rgb(99 99 99 / 13%) 0px 1px 4px 0px",
          ...(ownerState.variant === "outlined" && {
            background: theme.palette.background,
          }),
          "&:hover": {
            boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          },
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "10px !important",
        },
      },
    },
  },
});

export default mainTheme;
