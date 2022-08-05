import { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import Icons from "./../../utils/iconLib";
import MainContext from "../../store/main-context";

const logoStyle = {
  letterSpacing: 3.5,
  fontWeight: 600,
  fontFamily: "'Rajdhani', sans-serif",
  textDecoration: "none",
};

const appBarStyle = {
  marginBottom: "3rem",
  padding: ".5em",
  boxShadow: "rgba(33, 35, 38, 0.1) 0px 10px 10px -10px",
};

const headerBtnStyle = {
  gap: ".2em",
};

export default function Header() {
  const mainCtx = useContext(MainContext);
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    setAnchorEl(null);
    mainCtx.handleLogout();
    history.push("/");
  };

  const menuItems = (
    <div>
      <div>
        <MenuItem onClick={handleClose} component={Link} to={`/my-shops`}>
          My Shops
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} to="/seller/new-shop">
          Create Shop
        </MenuItem>
      </div>
      <div>
        <MenuItem onClick={handleClose} component={Link} to="/order-history">
          My Orders
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} to="/me">
          My account
        </MenuItem>
      </div>
      <div>
        <MenuItem
          onClick={handleClose}
          component={Link}
          to={`/deliveryman/dashboard`}
        >
          Dashboard
        </MenuItem>
      </div>
    </div>
  );

  return (
    <div>
      <AppBar color="primary" sx={{ ...appBarStyle }} position="static">
        <Toolbar sx={{ flexFlow: "row wrap" }}>
          <Typography
            component={Link}
            color="secondary"
            to="/"
            variant="h4"
            sx={{ ...logoStyle }}
          >
            SHOP EASY
          </Typography>
          <div style={{ marginLeft: "auto" }}>
            <Button
              color="secondary"
              sx={{ ...headerBtnStyle }}
              variant="text"
              id="header-menu"
              aria-controls="header-menu"
              aria-haspopup="true"
              aria-expanded={open ? true : undefined}
              onClick={handleClick}
            >
              <Icons.UserIcon color="secondary" />
              Mostafijur
            </Button>
          </div>
          <div
            style={{
              marginLeft: "auto",
              gap: "1em",
              display: "flex",
              flexFlow: "row wrap",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/sign-up"
            >
              <Typography>Sign Up</Typography>
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              component={Link}
              sx={{ ...headerBtnStyle }}
              to="/login"
            >
              <Icons.LockIcon />
              <Typography>Sign In</Typography>
            </Button>
          </div>
          <Menu
            id="header-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "header-button",
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            elevation={0}
            sx={{
              "& .MuiMenu-paper": {
                padding: "1em",
                marginTop: "1em",
              },
              "& .MuiMenu-list": {
                paddingTop: 0,
                paddingBottom: 0,
              },
            }}
          >
            {menuItems}

            <MenuItem
              onClick={handleLogout}
              sx={{
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <Button
                variant="text"
                color="secondary"
                sx={{
                  boxShadow: "none",
                }}
              >
                Logout
              </Button>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
}
