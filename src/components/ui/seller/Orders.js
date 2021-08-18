import React, { Fragment, } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    Button,
    makeStyles,
    Grid,
    Checkbox,
    FormControlLabel,
} from "@material-ui/core";
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
    },
    accordion: {
        marginTop: "2rem"
    }
}))

export default function DeliveryBoyOrders({orders, handleDeliveryStatus}) {
    const dashboardStyles = useStyle()
        
    return (
        <Fragment>
            {
                orders.map(order => (
                    <div key={`${order.from}${order.orderedTime}`}>
                        <Accordion className={dashboardStyles.accordion}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                >
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Typography>Order from { order.from}</Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button
                                            variant="text"
                                            classes={!order.deliveryStatus ?
                                                { root: dashboardStyles["status-btn-pending"] }
                                                :  {root: dashboardStyles["status-btn-delivered"]}}
                                        >
                                            {order.deliveryStatus ? "DELIVERED" : "PENDING"}
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Typography>{ new Date(order.orderedTime).toLocaleTimeString()}</Typography>
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
                                                <TableCell colSpan={2}>Shop Name</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                order.products.map(product => (
                                                    <TableRow
                                                        key={product.title}
                                                        className={dashboardStyles.hover }
                                                    >
                                                        <TableCell colSpan={2}>{ product.title}</TableCell>
                                                        <TableCell>{product.quantity}</TableCell>
                                                        <TableCell>{product.price}</TableCell>
                                                        <TableCell>{ product.shopTitle }</TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                            <TableRow selected={true} className={dashboardStyles.tableRow}>
                                                <TableCell align="center"></TableCell>
                                                <TableCell align="center"></TableCell>
                                                <TableCell align="left">Total</TableCell>
                                                <TableCell align="left" colSpan={2}>{ order.total }</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>       
                            </AccordionDetails>
                            <FormControlLabel
                                style={{float: "right"}}
                                control={<Checkbox checked={order.deliveryStatus}
                                color="primary"
                                onChange={() => {handleDeliveryStatus(order)}} />
                            }
                                label={order.deliveryStatus ? "Delivered" : "Mark as delivered" }
                            />
                        </Accordion>
                    </div>
                ))
            }
        </Fragment>    
    )
}