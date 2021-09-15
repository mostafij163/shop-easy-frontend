import React, {useState, useEffect} from "react"
import {
    makeStyles,
    Typography,
} from "@material-ui/core"
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button, Grid } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from "axios"

const useStyle = makeStyles(theme => ({
    box: {
        maxWidth: "45rem",
        margin: "auto",
        padding: "1rem",
    },
    list: {
        backgroundColor: theme.palette.secondary.dark,
        borderRadius: "4px",
        border: `1px solid #ed4b8224`,
        paddingBottom: 0,
    },
    "order-title": {
        fontFamily: "Ubuntu",
        fontSize: "1.2rem",
        fontWeight: 500,
    },
    status: {
        color: theme.palette.error.dark,
        float: "right",
    },
    "order-date": {
        fontSize: ".8rem",
    },
    "status-btn-pending": {
        backgroundColor: theme.palette.error.main
    },
    "status-btn-delivered": {
        backgroundColor: theme.palette.success.main
    },
}))

export default function Orders() {
    const [userJwt, setUserJwt] = useState("")
    const orderStyles = useStyle();
    const [orders, setOrders] = useState([])

    useEffect(() => {
        setUserJwt(localStorage.getItem("user"))
    }, [])

    useEffect(() => {
        if (userJwt) {
            axios.get("http://localhost:8000/order/my-orders", {
                headers: {
                    Authorization: `Bearer ${userJwt}`
                }
            }).then(res => {
                if (res.status == 200) {
                    console.log(res.data)
                    setOrders(res.data)
                }
            })
        }
    }, [userJwt])
    return (
        <div>
            {
                orders.length ?
                    orders.map(order => (
                        <Accordion key={order.id}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography>{ order.id }</Typography>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Button
                                            variant="text"
                                            classes={order.deliveryStatus === "pending" ?
                                                { root: orderStyles["status-btn-pending"] }
                                                :  {root: orderStyles["status-btn-delivered"]}}
                                        >
                                            {order.deliveryStatus}
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Typography>{ order.time }</Typography>
                                    </Grid>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TableContainer>
                                    <Table sx={{ minWidth: 650, width: "100%" }} aria-label="caption table">
                                        <caption>Order List</caption> 
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Product Name</TableCell>
                                                <TableCell>Quantities</TableCell>
                                                <TableCell>Price</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                order.products.map(prod => (
                                                    <>
                                                        <TableRow>
                                                            <TableCell>{ prod.title}</TableCell>
                                                            <TableCell>{prod.quantity}</TableCell>
                                                            <TableCell>{ prod.price}</TableCell>
                                                        </TableRow>
                                                    </>
                                                ))
                                            }
                                            <TableRow>
                                                <TableCell align="center"></TableCell>
                                                <TableCell align="left">Total</TableCell>
                                                <TableCell align="center">{order.total}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>       
                            </AccordionDetails>
                        </Accordion>
                    ))
                : null
          }  
        </div>
    )
}