import {useEffect, useState, useContext} from "react";
import Typography from '@material-ui/core/Typography';
import { makeStyles, } from "@material-ui/core";
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import { Link, Route } from "react-router-dom";
import DeliveryBoyOrders from "./ui/deliveryman/Orders";
import { io } from "socket.io-client"
import MainContext from "../store/main-context";
import axios from "axios";

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
  'drawer-icon': {
    fontSize: "1.5rem",
    color: "#f50057"
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


export default function DeliveryManDashboard(props) {
  const dashboardStyles = useStyle()
  const mainCtx = useContext(MainContext)
  const [userJwt, setUserJwt] = useState("")
  const [location, setLocation] = useState({
    lngLat: [],
    timestamp: 0
  })
  const [noLocation, setNoLocation] = useState(true)
  const [socket, setSocket] = useState()
  const [newOrders, setNewOrders] = useState()
  const [orders, setOrders] = useState([]);
  const [newStatusChangeRequest, setNewStatusChangeRequest] = useState()
  const [statusChangeRequests, setStatusChangeRequests] = useState([])

  useEffect(() => {
    setUserJwt(localStorage.getItem('user'))
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const lngLat = [position.coords.longitude, position.coords.latitude]
          setLocation({
            lngLat: lngLat,
            timestamp: position.timestamp
          })
          setNoLocation(false)
        },
        () => {
          setNoLocation(true)
          alert("Please allow to access location to continue")
        }
      )
    } else {
      alert("Please use a leatest browser")
    }
  }, [])

  useEffect(() => {
    if (userJwt&& location.lngLat.length) {
      const socket = io(`http://localhost:8000?coords=${location.lngLat}`, {
        extraHeaders: {
          Authorization: `Bearer ${userJwt}`
        }
      })
      setSocket(socket)
    }
  }, [userJwt, location])

  useEffect(() => {
    if (socket) {
      socket.on("new-order", function (order) {
        console.log(order)
        setNewOrders(order)
      })

      socket.on("delivery-status-change", function (changeToData) {
        setNewStatusChangeRequest(changeToData)
      })
    }
  }, [socket])

  useEffect(() => {
    if (newOrders) {
      setOrders([...orders, newOrders])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newOrders])

  useEffect(() => {
    if (userJwt) {
      axios.get("http://localhost:8000/order/deliveryman-orders", {
        headers: {
          Authorization: `Bearer ${userJwt}`
        }
      }).then(res => {
        if (res.status == 200) {
          console.log(res.data)
          setOrders(res.data)
        }
      })
    }
  }, [userJwt])

  useEffect(() => {
    if (newStatusChangeRequest) {
      setStatusChangeRequests([...statusChangeRequests, newStatusChangeRequest])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newStatusChangeRequest])

  function handleStatusChangeAccept(orderId, shopId) {
    const updatedOrders = orders.map(order => {
      if (order.id == orderId) {
        const shopWithProducts = order.products.find(shopWithProd => shopWithProd.id == shopId)
        shopWithProducts.products.deliveryStatus = "delivered"
        socket.emit("status-changed", {
          id: orderId,
          shopId: shopId,
          deliveryStatus: "delivered"
        })
      }
      return order
    })
    setOrders(updatedOrders)
  }

  function handleStatusChangeDecline(orderId, shopId) {
    socket.emit("status-changed", {
      id: orderId,
      shopId: shopId,
      deliveryStatus: "pending"
    })
  }

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
              badgeContent={0}
              color="error"
            >
              <ShoppingCartIcon style={{ fontSize: "2rem" }} color="primary" />
            </Badge>,
            url: `/deliveryman/dashboard/orders`
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
        {
          !noLocation ?
            <>
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
                  <Typography variant="h6" noWrap component={Link} to="/deliveryman/dashboard">
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
                <Route path="/deliveryman/dashboard/orders" >
                  <DeliveryBoyOrders
                    orders={orders}
                    deliveryManLocation={location.lngLat}
                    statusChangeRequests={statusChangeRequests}
                    handleStatusChangeAccept={handleStatusChangeAccept}
                    handleStatusChangeDecline={handleStatusChangeDecline}
                  />
                </Route>
              </main>
            </>
            :
            <div style={{
                backgroundColor: "#fff",
                color: "#f50057",
                margin: "26vh auto"
              }}
            >
              <Typography variant="h5">
                Loding Location
              </Typography>
            </div>
        }
    </div>
  );
}