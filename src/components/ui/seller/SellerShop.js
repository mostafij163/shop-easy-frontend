import { Fragment } from "react";
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

export default function SellerShop({shop}) {
    return (
        <Fragment>
            <Card style={{boxShadow: "none"}}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        alt="shop cover photo"
                        height="180"
                        image={`${shop.img}`}
                        title={shop.title}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {shop.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {shop.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Fragment>
    )
}