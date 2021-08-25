import React, { Fragment, } from "react";
import {
    CardMedia,
    CardContent,
    CardActions,
    CardActionArea,
    Card,
    Typography,
    IconButton,
    Grid,
} from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';

export default function Product({ products, handleQuantities }) {

    return (
        <Fragment>
            <Grid container spacing={1}>
                {
                    products.map(product => (
                        <Grid key={product["_id"]} item xs={12} md={4}>
                            <Card>
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
                                                style={{ display: "inline-block", width: "4rem" }}
                                            >
                                                TK. {product.price}
                                            </Typography>
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <IconButton
                                        style={{ margin: "0 auto" }}
                                        onClick={() => handleQuantities({ ...product, quantity: 1 })}
                                    >
                                        <AddCircleIcon style={{ fontSize: "3rem" }} color="primary" />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                }
            </Grid>
       </Fragment>
    )
}