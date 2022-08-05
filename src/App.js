import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import mainTheme from "./store/mainTheme";
import jwt from "jsonwebtoken";
import Header from "./components/common/Header";
import ShopEasyMainTheme from "./components/mainTheme";
import OrderHistory from "./components/ui/customer/OrdersHistory";
import Home from "./components/ui/Home";
import ShopDashboard from "./components/ShopDashboard";
import Login from "./components/ui/customer/Login";
import SellerLogin from "./components/ui/seller/Login";
import Signup from "./components/ui/customer/SignUp";
import Shop from "./components/Shop";
import CreateNewShop from "./components/ui/seller/CreateNewShop";
import DeliveryBoyDashboard from "./components/DeliverymanDashBoard";
import MainContext from "./store/main-context";
import SellerSignUp from "./components/ui/seller/SignUp";
import LoginToShop from "./components/ui/seller/LoginToShop";
import ShopFound from "./components/ui/ShopFound";
import DeliveryManSignUp from "./components/ui/deliveryman/DeliverymanSignUp";
import DeliveryManLogin from "./components/ui/deliveryman/DeliveryManLogin";
import { CssBaseline } from "@mui/material";

export default function App() {
  const [loginStatus, setLoginStatus] = useState(false);
  const [shop, setShop] = useState({});
  const [user, setUser] = useState({});
  const [userJwt, setUserJwt] = useState("");

  const handleUserJwt = (jwt) => {
    console.log(typeof jwt);
    if (typeof jwt === "string") {
      localStorage.setItem("user", jwt);
      setUserJwt(jwt);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserJwt("");
    setLoginStatus(false);
  };

  useEffect(() => {
    const userToken = localStorage.getItem("user");
    if (userToken) {
      const decodedUser = jwt.decode(userToken);
      setUser({
        name: decodedUser.name,
        role: decodedUser.aud,
        id: decodedUser.sub,
        activeStatus: decodedUser.activeStatus,
      });
      setLoginStatus(!loginStatus);
      if (decodedUser.aud === "seller") {
        const shop = localStorage.getItem("shop");
        if (shop) {
          const decodedShop = jwt.decode(shop);
          setShop(decodedShop);
        }
      }
    }
  }, [userJwt]);

  return (
    <Fragment>
      <MainContext.Provider
        value={{
          shop: shop,
          loginStatus: loginStatus,
          user: user,
          handleUserJwt: handleUserJwt,
          handleLogout: handleLogout,
        }}
      >
        <BrowserRouter>
          <ThemeProvider theme={mainTheme}>
            <CssBaseline />
            <Header />
            <Switch>
              <Route path="/sign-up" exact component={Signup} />
              <Route path="/login" exact component={Login} />
              <Route path="/order-history" exact component={OrderHistory} />
              <Route path="/me" exact></Route>
              <Route path="/shops" exact component={ShopFound} />
              <Route path="/shop/:shopId" exact component={Shop} />
              <Route path="/seller/new-shop" exact component={CreateNewShop} />
              <Route path="/seller/sign-up" exact component={SellerSignUp} />
              <Route path="/seller/login" exact component={SellerLogin} />
              <Route path="/my-shops" exact component={LoginToShop} />
              <Route
                path="/deliveryman/sign-up"
                exact
                component={DeliveryManSignUp}
              />
              <Route
                path="/deliveryman/login"
                exact
                component={DeliveryManLogin}
              />
              <Route path="/" exact component={Home} />
            </Switch>
            <Route path="/dashboard" component={ShopDashboard} />
            <Route
              path="/deliveryman/dashboard"
              component={DeliveryBoyDashboard}
            />
          </ThemeProvider>
        </BrowserRouter>
      </MainContext.Provider>
    </Fragment>
  );
}
