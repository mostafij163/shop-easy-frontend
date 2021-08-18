import React, {useEffect, useState, } from "react";
import Typography from '@material-ui/core/Typography';
import { makeStyles, } from "@material-ui/core";
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import { Link, Route, useParams } from "react-router-dom";
import DeliveryBoyOrders from "./ui/deliveryBoy/Orders";

const drawerWidth = 240;

const useStyle = makeStyles(theme => ({
    root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  "menu-list": {
    "&:hover": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.secondary.main,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing(1),
  },
}))


export default function DeliveryBoyDashboard(props) {
    const dashboardStyles = useStyle()
    const [user, setUser] = useState({})
    const userId = useParams()

    useEffect(() => {
        setUser({
            id: userId.deliverymanId,
            role: "deliveryboy"
        })
    }, [userId])

    const [newOrders, setNewOrders] = useState(10)
    const { window } = props;
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Divider />
      <List>
        {[
          {
            text: "Orders",
            icon: <Badge
              badgeContent={newOrders}
              color="error"
            >
              <ShoppingCartIcon style={{ fontSize: "2rem" }} color="primary" />
            </Badge>,
            url: `/deliveryman/${user.id}/dashboard/orders`
          },
        ].map((text) => (
            <ListItem
              button
              component={Link}
              to={text.url}
              key={text.text}
              classes={{root:dashboardStyles["menu-list"]}}
            >
                <ListItemIcon>
                    {
                      text.icon
                    }
                </ListItemIcon>
                <ListItemText primary={text.text} />
            </ListItem>
        ))
        }
      </List>
      <Divider />
      <List>
        {['Logout'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={dashboardStyles.root}>
      <CssBaseline />
      <AppBar position="fixed" className={dashboardStyles.appBar}>
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={dashboardStyles.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Delivery Man Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={dashboardStyles.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: dashboardStyles.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: dashboardStyles.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={dashboardStyles.content}>
          <Route path="/deliveryman/:deliverymanId/dashboard/orders" component={DeliveryBoyOrders} />
      </main>
    </div>
  );
}