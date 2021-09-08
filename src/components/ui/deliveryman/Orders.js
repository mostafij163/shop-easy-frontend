import {useState, useEffect, Fragment, } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, makeStyles, Grid, FormControlLabel, Checkbox} from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyle = makeStyles(theme => ({
    paper: {
        ...theme.paper,
        marginTop: 0,
        marginBottom: "1rem",
        width: "100%",
        maxWidth: "100%"
    },
    accordion: {
        marginBottom: "1rem",
        padding: "1rem"
    },
    accordionExpand: {
        "&:last-child": {
            backgroundColor: "#eaeaea"
        }
    },
    "status-btn-pending": {
        backgroundColor: theme.palette.error.main
    },
    "status-btn-delivered": {
        backgroundColor: theme.palette.success.main
    },
    hover: {
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
        }
    },
    tableRow: {
        backgroundColor: `${theme.palette.primary.main} !important`,
        color: `${theme.palette.secondary.main} !important`,
    }
}))

// TODO: show map

export default function DeliveryBoyOrders({orders, handleDeliveryStatus}) {
    const dashboardStyles = useStyle()

    console.log(orders)

//     customerName: "jewel "
// id: "6138e88d7eb709197473bb3d"
// products: Array(1)
// 0:
// category: "CLOTHANDSHOE"
// closingHour: "2021-08-23T14:00:39.982Z"
// coordinates: (2) [90.36538821979354, 23.774435854993886]
// id: "61238a127824480ca02f14bf"
// name: "shyamoli cloth store"
// openingHour: "2021-08-23T02:30:39.969Z"
// products:
// deliveryStatus: "pending"
// products: Array(1)
// 0: {productId: '61238b077824480ca02f14c5', title: 'Arong Shirt full sleeve ', price: 1750, quantity: 3}
// length: 1
// [[Prototype]]: Array(0)
// shopId: "61238a127824480ca02f14bf"
// [[Prototype]]: Object
// total: 5250
// [[Prototype]]: Object
// length: 1
// [[Prototype]]: Array(0)
// time: "2021-09-08T16:45:01.423Z"
// total: 5250


    useEffect(() => {
       
    }, [])
        
   return (
        <Fragment> {
            orders.length ?  orders.map(order => (
                <div key={`${order["_id"]}`}>
                    <Accordion
                        className={dashboardStyles.accordion}
                        classes={{expanded: dashboardStyles.accordionExpand}}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography>Order from { order.customerName}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button
                                        variant="text"
                                        classes={order.deliveryStatus ==="pending" ?
                                            { root: dashboardStyles["status-btn-pending"] }
                                            :  {root: dashboardStyles["status-btn-delivered"]}}
                                    >
                                        {order.deliveryStatus === "pending" ? "PENDING" : "DELIVERED"}
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Typography>{ order.time }</Typography>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={3}>
                                <Grid item lg={12}>
                                    {
                                        order.products.map(shopWithProducts => (
                                            <Accordion key={shopWithProducts.id}
                                                style={{
                                                    backgroundColor: "#fafafa", color: "#f50057"
                                                }}
                                                className={dashboardStyles.accordion}
                                            > 
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                >
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={6}>
                                                            <Typography>Order for { shopWithProducts.name}</Typography>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <Button
                                                                variant="text"
                                                                classes={shopWithProducts.products.deliveryStatus ==="pending" ?
                                                                    { root: dashboardStyles["status-btn-pending"] }
                                                                    :  {root: dashboardStyles["status-btn-delivered"]}}
                                                            >
                                                                {shopWithProducts.products.deliveryStatus === "pending" ? "PENDING" : "DELIVERED"}
                                                            </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Typography>{shopWithProducts.total } TK.</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <TableContainer>
                                                        <Table sx={{ minWidth: 650, width: "100%" }} aria-label="caption table">
                                                            <caption>Order List</caption> 
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell colSpan={2}>Product Name</TableCell>
                                                                    <TableCell>Quantities</TableCell>
                                                                    <TableCell>Price</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {
                                                                    shopWithProducts.products.products.map(product => (
                                                                        <TableRow
                                                                            key={product.productId}
                                                                            className={dashboardStyles.hover }
                                                                        >
                                                                            <TableCell colSpan={2}>{ product.title}</TableCell>
                                                                            <TableCell>{product.quantity}</TableCell>
                                                                            <TableCell>{product.price}</TableCell>
                                                                        </TableRow>
                                                                    ))
                                                                }
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>   
                                                </AccordionDetails>
                                            </Accordion>
                                        ))
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <TableContainer>
                                        <Table sx={{ minWidth: 650, width: "100%" }} aria-label="caption table">
                                            <TableBody>
                                                <TableRow selected={true} className={dashboardStyles.tableRow}>
                                                    <TableCell align="center"></TableCell>
                                                    <TableCell align="center"></TableCell>
                                                    <TableCell align="left">Total</TableCell>
                                                    <TableCell align="left" colSpan={2}>{ order.total }</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>   
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </div>
            )) : null
            }
        </Fragment>    
    )
}