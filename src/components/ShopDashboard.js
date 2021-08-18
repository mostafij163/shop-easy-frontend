import React, { useState, useEffect, useContext} from "react";
import Typography from '@material-ui/core/Typography';
import { makeStyles, } from "@material-ui/core";
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from "@material-ui/core/List"
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Badge from '@material-ui/core/Badge';
import { Link, Route, Switch} from "react-router-dom";
import axios from "axios"
import Orders from "./ui/seller/Orders";
import AddProduct from "./ui/seller/AddProduct";
import SellerShop from "./ui/seller/SellerShop"
import MainContext from "../store/main-context";
import Product from "./ui/seller/Product"

const drawerWidth = 240;

const useStyle = makeStyles(theme => ({
    root: {
    display: 'flex',
  },
  'drawer-icon': {
    fontSize: "1.5rem",
    color: "#f50057"
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
    padding: theme.spacing(3),
  },
}))


export default function ShopDashboard(props) {
  const dashboardStyles = useStyle()
  const mainCtx = useContext(MainContext);
  const [shop, setShop] = useState({})
  const [newOrders, setNewOrders] = useState(0)
  
  const [orders, setOrders] = useState([])

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/shop/${mainCtx.shop.sub}`).then(res => {
      setShop(res.data);
    })
    .catch(err => {
      console.log(err)
    })
    
        setOrders([...orders,
            {
                orderId: "1",
                from: "Mostafijur rahman",
                orderedTime: Date.now(),
                deliveryStatus: false,
                total: 2000,
                products: [
                    {
                        title: "burger",
                        price: 290,
                        quantity: 2,
                        shopid: "1",
                    },
                    {
                        title: "cheezy pizza",
                        price: 500,
                        quantity: 2,
                        shopid: "1",
                    },
                ]
            },
            {
                orderId: "3",
                from: "Hamza rahman",
                orderedTime: Date.now(),
                deliveryStatus: false,
                total: 2000,
                products: [
                    {
                        title: "burger",
                        price: 290,
                        quantity: 1,
                        shopid: "1",
                    },
                    {
                        title: "cheezy pizza",
                        price: 500,
                        quantity: 1,
                        shopid: "1",
                    },
                ]
            }
        ])
    }, [mainCtx])

    const handleDeliveryStatus = (order) => {
        const updatedOrders = orders.map(o => {
            if (o.orderId === order.orderId) {
                o.deliveryStatus = !o.deliveryStatus
            }
            return o;
        })
        setOrders(updatedOrders)
    };

    const { window } = props;
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

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
              <i className={`fas fa-cart-plus ${dashboardStyles["drawer-icon"]}`}></i>
            </Badge>,
            url: `/dashboard/orders`
          },
          {
            text: "Add Product",
            icon: <i className={`fas fa-plus-circle ${dashboardStyles["drawer-icon"]}`}></i>,
            url: `/dashboard/add-new-product`
          },
          {
            text: "Products",
            icon: <i className={`fas fa-clipboard-list ${dashboardStyles["drawer-icon"]}`}></i>,
            url: `/dashboard/products`
          },
          {
            text: "Home",
            icon: <i className={`fas fa-house-user ${dashboardStyles["drawer-icon"]}`}></i>,
            url: `/`
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
        {[
          
          {
            text: "Logout",
            url: '/'
          }
        ].map((text) => (
          <ListItem
            button
            key={text.text}
            component={Link}
            to={text.url}
            classes={{ root: dashboardStyles["menu-list"] }}
            onClick={mainCtx.handleLogout}
          >
            <ListItemText primary={text.text} />
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
            <Typography
              component={Link}
              to={`/dashboard`}
              variant="h6" noWrap
            >
              Shop Dashboard
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
          <Switch>
            <Route path="/dashboard/products" exact>
              <Product/>
            </Route>
            <Route path="/dashboard/orders" exact>
              <Orders orders={orders} handleDeliveryStatus={handleDeliveryStatus} />
            </Route>
            <Route path="/dashboard/add-new-product" exact>
              <AddProduct shopCategory={shop.shopCategory}/>
            </Route>
            <Route path="/dashboard" exact>
              <SellerShop shop={{
                title: shop.name,
                description: shop.description,
                openingHour: shop.openingHour,
                closingHour: shop.closingHour,
                img: '/images/pasta-shop.jpg'
              }} />
            </Route>
          </Switch>
      </main>
    </div>
  );
}

// closingHour: "4:01:47 PM"
// createdAt: "2021-08-15T10:02:17.105Z"
// description: "a medicine shop at opposite of national heart foundation hospital"
// location: {type: "Point", _id: "6118e62978b4f52128aace7f", coordinates: {…}}
// name: "mirpur medicine store"
// openingHour: "4:01:47 PM"
// owner: "6118ab3378b4f52128aace7d"
// shopCategory: "MEDICINE"
// updatedAt: "2021-08-15T10:02:17.105Z"
// __v: 0