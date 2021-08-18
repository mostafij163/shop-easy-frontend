import { createTheme } from '@material-ui/core/styles';

export default createTheme({
  palette: {
    common: {},
    primary: {
      main: "#f50057",
    },
    secondary: {
      main: '#fff',
      dark: "#ededed",
    },
  },
  paper: {
        maxWidth: "50rem",
        paddingBottom: "2rem",
        marginTop: "1rem",
        margin: "auto",
        boxShadow: "0px 2px 1px -1px rgb(233 30 99 / 100%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)"
  },
  "btn-container-full": {
      width: "90%",
      margin: "2rem auto",
      marginBottom: "0"
  },
  "submit-btn": {
        width: "100%",
        padding: "10px 19px",
        boxShadow: "none",
    },
})