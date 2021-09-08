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
import EditProduct from "./ui/seller/EditProduct";
import { io } from "socket.io-client"

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
  const [shop, setShop] = useState({
    name: "",
    owner: "",
    shopCategory: "",
    description: "",
    location: {
      type: "",
      coordinates: []
    },
    openingHour: "",
    closingHour: ""
  })
  const [newOrders, setNewOrders] = useState("")
  const [products, setProducts] = useState([])
  const [editProduct, setEditProduct] = useState({})
  const [orders, setOrders] = useState([])
  const [userJwt, setUserJwt] = useState("")
  const [shopJwt, setShopJwt] = useState("");
  const [socket, setSocket] = useState()

  useEffect(() => {
    const userToken = localStorage.getItem('user')
    if (userToken) {
      setUserJwt(userToken)
    }
    const shopToken = localStorage.getItem("shop");
    setShopJwt(shopToken);
  }, [])

  useEffect(() => {
    if (userJwt) {
      axios.get(`
        http://127.0.0.1:8000/shop/login/${props.location.state ? props.location.state.id : mainCtx.shop.sub}`,
        {
          headers: {
            Authorization: `Bearer ${userJwt}`
          }
        }
      ).then(res => {
        setShop(res.data.shop);
        localStorage.setItem('shop', res.data.jwt)
      })
      .catch(err => {
        alert(err.message)
      })
    }
  }, [mainCtx, props.location.state, userJwt])

  useEffect(() => {
    if (userJwt && shopJwt) {
      const socket = io('http://localhost:8000', {
        extraHeaders: {
          Authorization: `Bearer ${userJwt}`,
          'x-shop-jwt': `Bearer ${shopJwt}`
        }
      })
      setSocket(socket)
    }
  }, [userJwt, shopJwt])

  useEffect(() => {
    if (socket) {
      socket.on('new-order', function (orderData) {
        setNewOrders(orderData)
      })
    }
  }, [socket])

  useEffect(() => {
    if (newOrders) {
      setOrders([...orders, newOrders])
    }
  }, [newOrders])
  
  function fetchProducts(userJwt, shopJwt) {
    if (userJwt && shopJwt) {
      axios.get(
        `http://127.0.0.1:8000/shop/product`,
        {
          headers: {
              Authorization: `Bearer ${userJwt}`,
              'x-shop-jwt': `Bearer ${shopJwt}` 
            }
        }
        ).then(res => {
            if (res.status == 200) {
            setProducts(res.data)
            }
        })
    }
  }

  function handleEditProduct(productId) {
    const productToEdit = products.find(prod => prod["_id"] === productId)
    setEditProduct(productToEdit)
  }

  function handleDeleteProduct(userJwt, shopJwt, productId) {
    axios.delete(`http://127.0.0.1:8000/shop/product/${productId}`,
      {
        headers: {
            Authorization: `Bearer ${userJwt}`,
            'x-shop-jwt': `Bearer ${shopJwt}` 
          }
      }
    ).then(res => {
      if (res.status == 200) {
          const productAfterDelete = products.filter(prod => {
            if (prod["_id"] !== productId) {
              return prod
            }
          })
          setProducts(productAfterDelete)
      }
    }).catch(err => {
          alert(err.message)
    })
  }

    const handleDeliveryStatus = (event, order) => {
        const updatedOrders = orders.map(o => {
            if (o["_id"] === order["_id"]) {
              o.products.deliveryStatus = event.target.checked ? "delivered" : "pending"
              const data =  {
                id: order.id,
                shopId: order.products.shopId,
                changeTo: o.products.deliveryStatus
              }

              socket.emit("status-change-shop", data)
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
              badgeContent={1}
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
              {/* <LoginToShop/> */}
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
              <Product
                fetchProducts={fetchProducts}
                products={products}
                handleEditProduct={handleEditProduct}
                handleDeleteProduct={handleDeleteProduct}
              />
            </Route>
            <Route path="/dashboard/products/:productId" exact>
              <EditProduct product={ editProduct}/>
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
