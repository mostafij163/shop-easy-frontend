import { useEffect, useState, } from "react"
import {useHistory } from "react-router-dom"
import {
    Paper,
    makeStyles,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    CardMedia,
    Grid
} from "@material-ui/core"

const useStyle = makeStyles(theme => ({
    paper: {
        ...theme.paper,
        maxWidth: "100%",
        paddingBottom: 0,
        marginBottom: "2rem",
        boxShadow: "none"
    },
    root: {
        width: "100%",
        margin: "0 auto"
    }
}))

export default function ShopFound(props) {
    const classes = useStyle()
    const history = useHistory()
    const [shops, setShops] = useState([])

    useEffect(() => {
        props.location.state ? setShops(props.location.state.shops) : setShops([])
    }, [props.location.state])
    console.log(shops)
    const allCategories = Array.from(new Set(shops.map(shop => shop.shopCategory)))

    function handleShopClick(shopId) {
        history.push(`/shop/${shopId}`)
    }

    
    const allShops = allCategories.map(cat => {
        return (
            <Paper key={cat} classes={{root: classes.paper}}>
                <Typography variant="h5" style={{padding : "1rem"}}>
                    {cat.split("").map((str, index) => index == 0 ? str : str.toLowerCase())} Shops
                </Typography>
                <Grid container spacing={2}>
                    {
                        shops.map(shop => {
                            if (shop.shopCategory === cat) {
                                return (
                                    <Grid
                                        item
                                        xs={6}
                                        md={3}
                                        key={shop["_id"]}
                                    >
                                        <Card
                                            style={{ height: "100%" }}
                                            onClick={() => {
                                                handleShopClick(shop["_id"])
                                            }}
                                        >
                                            <CardActionArea>
                                                <CardMedia
                                                    image="images/shops/shop.jpg"
                                                    title="shop cover photo"
                                                    component="img"
                                                    alt="shop cover photo"
                                                    height="160"
                                                />
                                            </CardActionArea>
                                            <CardContent>
                                                <Typography variant="h6">
                                                    {shop.name}
                                                </Typography>
                                                <Typography variant="caption">
                                                    {shop.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )
                            }
                        })
                    }
                </Grid>
            </Paper>
        )
    })

    return (
        <div className={classes.root}>
            {allShops}
        </div>
    )
}