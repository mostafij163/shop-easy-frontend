import React, {useState, useEffect} from "react";
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
    const [shop, setShop] = useState()
    
    useEffect(() => {
       axios.get(`http://127.0.0.1:8000/shop/${id}`).then(res => {
            if (res) {
                if (res.status == 200) {
                    setShop(res.data)
                }
            }
        })
        .catch(err => {
            console.log(err)
        })
        
        // setProducts([
        //     {
        //         productId: "01",
        //         title: "cheezy pizza",
        //         price: 500,
        //         img: "/images/product-images/pasta-1.jpg",
        //         category: "fastfood",
        //         shopid: "1"
        //     },
        //     {
        //         productId: "02",
        //         title: "cheezy pasta",
        //         price: 310,
        //         img: "/images/product-images/pasta-2.jpg",
        //         category: "fastfood",
        //         shopid: "1"
        //     },
        //     {
        //         productId: "03",
        //         title: "spicy pasta",
        //         price: 280,
        //         img: "/images/product-images/pasta-3.jpg",
        //         category: "fastfood",
        //         shopid: "1"
        //     },
        //     {
        //         productId: "04",
        //         title: "mexican rice bowl",
        //         price: 340,
        //         img: "/images/product-images/rice-1.jpg",
        //         category: "rice",
        //         shopid: 1
        //     }
        // ])
        // setProductCategories(new Set(products.map(prod => prod.category)))
    }, [])

    // const [orderedProduct, setorderedProduct] = useState([]);

    // function handleQuantities(product) {
    //     const existingProduct = orderedProduct.find(prod => prod.productId === product.productId)
    //     if (!existingProduct) {
    //         setorderedProduct([...orderedProduct, product])
    //     } else {
    //         const updatedState = orderedProduct.map(product => {
    //             if (product.productId === existingProduct.productId) {
    //                 product.quantity += 1
    //             }
    //             return product
    //         })
    //         setorderedProduct(updatedState)
    //     }
    // }

    // function handleRemoveItem(prod) {
    //     if (prod.quantity > 1) {
    //         const updatedOrderedProduct = orderedProduct.map((product) => {
    //             if (product.productId === prod.productId) {
    //                 product.quantity -= 1
    //             }
    //             return product;
    //         })
    //         setorderedProduct(updatedOrderedProduct)
    //     } else {
    //         const productToRemove = orderedProduct.find(product => product.productId === prod.productId)
    //         const updatedProducts = orderedProduct.filter((product) => product.productId !== productToRemove.productId)
    //         setorderedProduct(updatedProducts)
    //     }
    // }

    return (
        <Grid container spacing={2} >
            {console.log(shop)}
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
                    {/* <Filter
                        category={shop.shopCategory}
                        productCategories={productCategories}
                    /> */}
                    <Paper style={{
                        margin: "50px auto",
                        width: "100%",
                        boxShadow: "none"
                    }}>
                        <Product shop={shop}/>
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
                {/* <ShoppingCart orderedProduct={orderedProduct} handleRemoveItem={ handleRemoveItem}/> */}
            </Grid>
       </Grid>
    )
}