import React, {useState, useEffect, useContext} from "react";
import {
    CardMedia,
    CardContent,
    CardActions,
    CardActionArea,
    Card,
    Typography,
    IconButton,
    makeStyles,
} from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import axios from "axios"
// import { RemoveCircle } from "@material-ui/icons";
import MainContext from "../../../store/main-context";
import { Fragment } from "react";

const useStyle = makeStyles(() => ({

}))

export default function Product({product}) {
    const productStyles = useStyle()
    const [products, setProducts] = useState([])

    useEffect(() => {
        const shopJwt = localStorage.getItem('shop')
        console.log(shopJwt)
        axios.get(
        `http://127.0.0.1:8000/shop/products`,
        {
            headers: {
                'X-shop-jwt': `Bearer ${shopJwt}` 
            }
        }
        ).then(res => {
        if (res.status == 200) {
            console.log(res.data)
            setProducts(res.data)
            }
        })
    }, [])

    return (
        <Fragment>
            {/* <Card className={productStyles.root}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        alt="product photo"
                        height="170"
                        image={product.img}
                        title={product.title}
                    />
                    <CardContent>
                        <Typography
                            variant="h6"
                            component="h2"
                        >
                            {
                                product.title
                            }
                            {
                                product.shopCategory === "MEDICINE" ?
                                    <Typography variant="caption">
                                        {product.group}
                                    </Typography> : null
                            }
                            <Typography
                                variant="button"
                                color="primary"
                                style={{display: "inline-block", width: "4rem"}}
                            >
                                TK. {product.price}
                            </Typography>
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <IconButton
                        style={{ margin: "0 auto" }}
                        onClick={() => product.handleQuantities({ ...product, quantity: 1 })}
                    >
                        <AddCircleIcon style={{fontSize: "3rem"}} color="primary"/>
                    </IconButton>
                </CardActions>
            </Card> */}
            <p>some</p>
       </Fragment>
    )
}