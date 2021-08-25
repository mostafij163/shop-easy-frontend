import React, { useContext, } from "react"
import { Link, useHistory } from "react-router-dom";
import {
    useScrollTrigger,
    AppBar,
    Toolbar,
    Slide,
    Typography,
    makeStyles,
    Button,
    Menu,
    MenuItem,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import MainContext from "../../store/main-context";

function HideOnScroll(props) {
  const { children, } = props;
    const trigger = useScrollTrigger({
        threshold: 300,
    });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const useStyle = makeStyles( theme => ({
    logo: {
        fontFamily: "PT Sans, Ubuntu",
        letterSpacing: 7.5,
        fontWeight: 600,
        fontSize: "1rem",
        width: "50%",
        color: theme.palette.primary.main
    },
    AppBar: {
        boxShadow: "none",
        marginBottom: "3rem"
    },
    loginBtn: {
        padding: "8px 14px",
        "&:hover": {
            background: "transparent"
        },
    },
    "loginBtn-icon": {
        fontSize: '1.7rem',
        paddingRight: ".3rem",
    },
    "sign-btn": {
        padding: "10.5px 26px",
        margin: ".3rem"
    },
    accName: {
        fontSize: ""
    },
    menu: {
        // border: `1px solid ${theme.palette.secondary.dark}`,
        boxShadow: `.8px 1.6px #b2b2b27d`,
        paddingBottom: 0
    },
    menuList: {
        paddingBottom: 0
    },
    menuItem: {
        padding: ".9rem 2rem",
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.secondary.main,
        }
    }
}))

export default function Header() {
    const mainCtx = useContext(MainContext);
    const history = useHistory()
    
    const headerClasses = useStyle();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);

    };
    const handleLogout = () => {
        setAnchorEl(null);
        mainCtx.handleLogout()
        history.push('/')
    }
    return (
        <div>
            <HideOnScroll>
                <AppBar color="secondary" classes={{root: headerClasses.AppBar}} position="static">
                    <Toolbar>
                        <Typography style={{textDecoration: "none"}} component={Link} to="/" variant="h6" className={headerClasses.logo}>SHOPEASY</Typography>
                        {
                            mainCtx.loginStatus ?
                                <div style={{marginLeft: "auto"}}>
                                    <Button
                                        className={headerClasses.loginBtn}
                                        id="header-menu"
                                        aria-controls="header-menu"
                                        aria-haspopup="true"
                                        aria-expanded={open ? true : undefined}
                                        onClick={handleClick}
                                    >
                                        <AccountCircleIcon color="primary" className={headerClasses["loginBtn-icon"]}></AccountCircleIcon>
                                        <Typography className={headerClasses.accName}>{ mainCtx.user.name.toUpperCase()}</Typography>
                                    </Button> 
                                </div> 
                                :
                                <div style={{marginLeft: "auto"}}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={headerClasses["sign-btn"]}
                                        component={Link}
                                        to="/sign-up"
                                    >
                                        <Typography variant="h6">Sign Up</Typography>
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        className={headerClasses.loginBtn}
                                        component={Link}
                                        to="/login"
                                    >
                                        <AccountCircleIcon className={ headerClasses["loginBtn-icon"]}/>
                                        <Typography variant="h6">Sign In</Typography>
                                    </Button>
                                </div>
                        }
                        <Menu
                            id="header-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'header-button',
                            }}
                            classes={{
                                paper: headerClasses.menu,
                                list: headerClasses.menuList
                            }}
                            getContentAnchorEl={null}
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            transformOrigin={{ vertical: "top", horizontal: "center" }}
                            elevation={0}
                        >
                            {
                                mainCtx.user.role === "seller" ?
                                    <div>
                                        <MenuItem
                                            classes={{ root: headerClasses.menuItem }}
                                            onClick={handleClose}
                                            component={Link}
                                            to={`/my-shops`}
                                        >
                                            My Shops
                                        </MenuItem>
                                        <MenuItem
                                            classes={{ root: headerClasses.menuItem }}
                                            onClick={handleClose}
                                            component={Link}
                                            to="/seller/new-shop"
                                        >
                                            Create Shop
                                        </MenuItem>
                                    </div>
                                    :
                                    <div>
                                        <MenuItem
                                            classes={{root: headerClasses.menuItem}}
                                            onClick={handleClose}
                                            component={Link}
                                            to="/order-history"
                                            >My Orders</MenuItem>
                                        <MenuItem
                                            classes={{root: headerClasses.menuItem}}
                                            onClick={handleClose}
                                            component={Link}
                                            to="/me"
                                        >My account</MenuItem>
                                    </div>
                            }
                            
                            <MenuItem
                                classes={{root: headerClasses.menuItem}}
                                onClick={handleLogout}
                                component={Link}
                                to="/"
                            >Logout</MenuItem>
                        </Menu>
                    </Toolbar>
            </AppBar>
            </HideOnScroll>
        </div>
    )
}