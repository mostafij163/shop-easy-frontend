import {useState, useEffect, Fragment, } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
    Button,
    makeStyles,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import msToTime from "../../../store/miliSecToTime";
import { mapboxApiKey } from "../../../store/map-box";
import ReactMapGL, { Marker } from 'react-map-gl';
import RoomIcon from '@material-ui/icons/Room';

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

// TODO: // TODO: // TODO: // TODO: 
// TODO: 
// TODO: show map

export default function DeliveryBoyOrders({
    orders,
    statusChangeRequests,
    handleStatusChangeAccept,
    handleStatusChangeDecline,
    deliveryManLocation
}) {
    const dashboardStyles = useStyle()
        const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: deliveryManLocation[1],
        longitude: deliveryManLocation[0],
        zoom: 12
    });
    const [openMap, setOpenMap] = useState(false);
    const [shopLocation, setShopLocation] = useState([])

    // useEffect(() => {
    //     if (deliveryManLocation.length) {
    //         setViewport({
    //             width: "100vw",
    //             height: "100vh",
    //             latitude: deliveryManLocation[1],
    //             longitude: deliveryManLocation[0],
    //             zoom: 15
    //         })
    //     }
    // }, [deliveryManLocation])

    function handleOpenMap(lngLat) {
         setShopLocation(lngLat)
        setOpenMap(true)
    }

     const handleCloseMap = () => {
        setOpenMap(false);
    };

    useEffect(() => {
            orders.map(order => {
                statusChangeRequests.map(statusChangeRequest => {
                    if (order.id == statusChangeRequest.id) {
                        order.products.map(shopWithProducts => {
                            if (shopWithProducts.id === statusChangeRequest.shopId) {
                                shopWithProducts.requestStatusChange = true;
                            }
                        }) 
                    }
                })
           })
    }, [orders, statusChangeRequests])
        
   return (
       <Fragment>
           <div>
                <Dialog
                    fullScreen={true}
                    open={openMap}
                    onClose={handleCloseMap}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Shop Location"}</DialogTitle>
                    <DialogContent>
                        <div>
                            <ReactMapGL
                                {...viewport}
                                mapboxApiAccessToken={ mapboxApiKey}
                                onViewportChange={nextViewport => setViewport(nextViewport)}
                                mapStyle="mapbox://styles/mostafij163/cksalt6m652ig17qpge35l96v"
                            >
                                <Marker
                                    latitude={deliveryManLocation[1]} 
                                    longitude={deliveryManLocation[0]}
                               ><RoomIcon style={{fontSize: "2rem"}} color= "primary" /></Marker>
                               <Marker
                                    latitude={shopLocation[1]} 
                                    longitude={shopLocation[0]}
                                ><RoomIcon style={{fontSize: "3rem", color:"red"}}/></Marker>
                            </ReactMapGL>
                        </div>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleCloseMap} color="primary">
                        Save
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
           {
            orders.length ?  orders.map(order => (
                <div key={`${order.id}`}>
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
                                    <Typography>{
                                        msToTime(Date.now() - new Date(order.time).getTime())
                                    }</Typography>
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
                                                        <Grid item xs={2}>
                                                            <Typography>{shopWithProducts.total } TK.</Typography>
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => handleOpenMap(shopWithProducts.coordinates)}
                                                            >Open Shop Location</Button>
                                                        </Grid>
                                                    </Grid>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    {
                                                        shopWithProducts.requestStatusChange ?
                                                            <div>
                                                                <Button
                                                                    color="primary"
                                                                    variant="contained"
                                                                    onClick={() => handleStatusChangeAccept(order.id, shopWithProducts.id)}
                                                                >Accept as delivered</Button>
                                                                <Button
                                                                    onClick={() => handleStatusChangeDecline(order.id, shopWithProducts.id)}
                                                                    variant="contained"
                                                                >Decline</Button>
                                                            </div> : null
                                                    }
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