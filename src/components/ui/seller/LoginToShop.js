
import { useState, Fragment, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Paper, FormControl, InputLabel, Select, MenuItem, makeStyles } from "@material-ui/core";
import axios from "axios"

const useStyle = makeStyles(theme => ({
    paper: {
        ...theme.paper,
        marginTop: "40vh",
        width: "30rem"
    },
    formControlRoot: {
        width: "100%",
        height: 0,
    }
}))

export default function LoginToShop() {
    const logintoShopStyles = useStyle()
    const history = useHistory()
    const [shops, setShops] = useState([])
    const [shop, setShop] = useState("")
    const [userJwt, setUserJwt] = useState("")

    useEffect(() => {
        const jwt = localStorage.getItem("user")
        if (jwt) {
            setUserJwt(jwt)
        }
    }, [])

    useEffect(() => {
        if (userJwt) {
            axios.get(`http://127.0.0.1:8000/shop/my-shops`, {
                headers: {
                    Authorization: `Bearer ${userJwt}`
                }
            }).then(res => {
                if(res.status == 200) setShops(res.data)
            }).catch(err => {
                alert(err.message)
            })
        }
    }, [userJwt])

    function handleShopLogin(e) {
        setShop(e.target.value)
        history.push({
            pathname: "/dashboard",
            state: {id: e.target.value}
        })
    }

    return (
        <Fragment>
            <Paper classes={{root: logintoShopStyles.paper}}>
                <FormControl
                    variant="outlined"
                    classes={{ root: logintoShopStyles.formControlRoot }}
                >
                    <InputLabel id="demo-simple-select-outlined-label">Select Shop</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        label="select shop"
                        onChange={handleShopLogin}
                        value={shop}
                    >
                        {
                            shops.map(shop => (
                                <MenuItem
                                    key={shop["_id"]}
                                    value={shop["_id"]}
                                >
                                    {shop.name}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Paper>
        </Fragment>
    )
}