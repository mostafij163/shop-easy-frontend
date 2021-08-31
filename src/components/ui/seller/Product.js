import React, { useEffect, Fragment, useState, } from "react";
import {Link, } from "react-router-dom"
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
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"

const useStyle = makeStyles(() => ({
    root: {
        margin: "1rem"
    }
}))

export default function Product({
    products,
    fetchProducts,
    handleEditProduct,
    handleDeleteProduct
}) {
    const productStyles = useStyle()
    const [userJwt, setUserJwt] = useState("")
    const [shopJwt, setShopJwt] = useState("")

    useEffect(() => {
        const userToken = localStorage.getItem("user")
        const shopToken = localStorage.getItem("shop")
        setUserJwt(userToken)
        setShopJwt(shopToken)
    }, [])

    useEffect(() => {
        fetchProducts(userJwt, shopJwt)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userJwt, shopJwt])

    const productList = products.map((prod) => (
        <Card key={ prod["_id"] } className={productStyles.root}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    alt="product photo"
                    height="170"
                    image={prod.img}
                    title={prod.title}
                />
                <CardContent>
                    <Typography
                        variant="h6"
                        component="h2"
                    >
                        { prod.title }
                        <Typography
                            variant="button"
                            color="primary"
                            style={{display: "inline-block", width: "4rem"}}
                        >
                            TK. {prod.price}
                        </Typography>
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <IconButton
                    style={{ margin: "0 auto" }}
                    component={Link}
                    to={`/dashboard/products/${prod["_id"]}`}
                    onClick={() => {
                        handleEditProduct(prod["_id"])
                    }}
                >
                    <EditIcon style={{fontSize: "2rem"}} color="primary"/>
                </IconButton>
                <IconButton
                    style={{marginRight: "auto"}}
                    onClick={() => {
                        handleDeleteProduct(userJwt, shopJwt, prod["_id"])
                    }}
                >
                    <DeleteIcon style={{fontSize: "2rem"}} color="primary"/>
                </IconButton>
            </CardActions>
        </Card>
    ))

    return (
        <Fragment>
            { productList }
       </Fragment>
    )
}