import React, {useState, useEffect,} from "react";
import {
    Typography,
    Button,
    CardMedia,
    CardContent,
    CardActions,
    CardActionArea,
    Card,
    Paper,
    makeStyles,
    Grid,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import axios from "axios";
import Filter from "./ui/shop/Filter";
import Product from "./ui/shop/Product";
import ShoppingCart from "./ui/shop/ShoppingCart";

const useStyle = makeStyles(() => ({
    
}))

export default function Shop() {
    const shopStyles = useStyle()
    const id = useParams().shopId
    const [shop, setShop] = useState({
        closingHour: "",
        description: "",
        name: "",
        openingHour: "",
        shopCategory: "",
        _id: ""
    })
    const [products, setProducts] = useState([])
    const [productCategories, setProductCategories] = useState([])
    const [productManuFacs, setProductManuFacs] = useState([])

    useEffect(() => {
       axios.get(`http://127.0.0.1:8000/shop/${id}`).then(res => {
           if (res) {
                console.log(res)
                if (res.status == 200) {
                    setShop(res.data)
                    console.log(res.data)
                    requestProducts(res.data.shopCategory)
                }
            }
        })
        .catch(err => {
            console.log(err)
        })
    }, [id])

    function requestProducts(shopCategory, query) {
        console.log(shopCategory, query)
        if (query) {
            const { category, manufacturer, sort } = query
            axios.get(
                `http://127.0.0.1:8000/shop/filter-products/${id}/${shopCategory}?category=${category}&manufacturer=${manufacturer}&sort=${sort ? 1 : -1}`
            )
            .then(res => {
                console.log(res.data)
                setProducts(res.data)
                const prodCategoriesArr = res.data.map(prod => prod.category)
                const prodCategories = Array.from(new Set(prodCategoriesArr));
                setProductCategories(prodCategories)

                const prodManuFacArr = res.data.map(prod => prod.manufacturer)
                const prodManuFacs = Array.from(new Set(prodManuFacArr))
                setProductManuFacs(prodManuFacs)
            })
        } else {
            axios.get(
                `http://127.0.0.1:8000/shop/filter-products/${id}/${shopCategory}`
            ).then(res => {
                setProducts(res.data)
                const prodCategoriesArr = res.data.map(prod => prod.category)
                const prodCategories = Array.from(new Set(prodCategoriesArr));
                setProductCategories(prodCategories)

                const prodManuFacArr = res.data.map(prod => prod.manufacturer)
                const prodManuFacs = Array.from(new Set(prodManuFacArr))
                setProductManuFacs(prodManuFacs)
            })
        }
    }

    const [orderedProduct, setorderedProduct] = useState([]);

    function handleQuantities(product) {
        console.log(product)
        console.log(orderedProduct)
        const existingProduct = orderedProduct.find(prod => prod["_id"] === product["_id"])
        if (!existingProduct) {
            setorderedProduct([...orderedProduct, product])
        } else {
            const updatedState = orderedProduct.map(product => {
                if (product["_id"] === existingProduct["_id"]) {
                    product.quantity += 1
                }
                return product
            })
            setorderedProduct(updatedState)
        }
    }

    function handleRemoveItem(prod) {
        if (prod.quantity > 1) {
            const updatedOrderedProduct = orderedProduct.map((product) => {
                if (product["_id"] === prod["_id"]) {
                    product.quantity -= 1
                }
                return product;
            })
            setorderedProduct(updatedOrderedProduct)
        } else {
            const productToRemove = orderedProduct.find(product => product["_id"] === prod["_id"])
            const updatedProducts = orderedProduct.filter((product) => product["_id"] !== productToRemove["_id"])
            setorderedProduct(updatedProducts)
        }
    }

    return (
        <Grid container spacing={2} >
            <Grid item xs={12} md={9}>
                <Card className={shopStyles.root} style={{boxShadow: "none"}}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            alt="shop cover photo"
                            height="180"
                            image="/images/pasta-shop.jpg"
                            title={shop.name}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                {shop.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {shop.description}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    { console.log(shop)}
                    <Filter
                        category={shop.shopCategory}
                        productCategories={productCategories}
                        manufacturers={productManuFacs}
                        requestProducts={requestProducts}
                    />
                    <Paper style={{
                        margin: "50px auto",
                        width: "100%",
                        boxShadow: "none"
                    }}>
                        <Product
                            products={products}
                            handleQuantities={handleQuantities}
                        />
                    </Paper>
                    <CardActions>
                        <Button size="small" color="primary">
                        Share
                        </Button>
                        <Button size="small" color="primary">
                        Report
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            <Grid item xs={12} md={3} >
                <ShoppingCart
                    orderedProduct={orderedProduct}
                    handleRemoveItem={handleRemoveItem}
                />
            </Grid>
       </Grid>
    )
}