import { useEffect, useState, } from "react";
import axios from "axios";
import {
    Button,
    TableRow,
    TableHead,
    TableContainer,
    TableCell,
    TableBody,
    Table,
    Paper,
    makeStyles,
    IconButton,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import { RemoveCircle } from "@material-ui/icons";
import ReactMapGL, { Marker } from 'react-map-gl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { mapboxApiKey } from "../../../store/map-box";

const useStyle = makeStyles(() => ({
    paper: {
        height: "auto",
    },
    input: {
        width: "100%",
        minWidth: "10rem",
        margin: "2rem 2rem 0rem 2rem",
    },
    "product-card": {

    },
    "submit-btn": {
        width: "100%",
        padding: "10px 19px",
        boxShadow: "none",
        marginTop: "2rem",
        marginBottom: "2rem"
    },
}))

export default function ShoppingCart({orderedProduct, handleRemoveItem}) {
    const cartStyles = useStyle()
    const [total, setTotal] = useState(0)
    const [userJwt, setUserJwt] = useState("")
    const [shopJwt, setShopJwt] = useState("")
    const [location, setLocation] = useState([])
    const [locInfo, setLocInfo] = useState([])
    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: 23.7338028,
        longitude: 90.3814551,
        zoom: 12
    });
    const [openMap, setOpenMap] = useState(false);

    useEffect(() => {
        const userToken = localStorage.getItem("user")
        const shopToken = localStorage.getItem("shop")
        setUserJwt(userToken)
        setShopJwt(shopToken)
    }, [])

    useEffect(() => {
        setViewport({
            width: "100vw",
            height: "100vh",
            latitude: location[1],
            longitude: location[0],
            zoom: 15
        })
    }, [location])

    function handleCoordinates(e) {
        setLocation(e.lngLat)
    }

    const handleLocationChange = (event) => {
        const strings = event.target.value.split(" ");
        const trimedStrings = strings.map(str => str.trim())
        const encodedString = trimedStrings.join("%20")

        axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedString}.json?access_token=${mapboxApiKey}&country=BD`
        ).then(res => {
            if (res.status == 200) {
                setLocInfo(res.data.features)  
            }
        }).catch(err => {
            alert(err.message)
        })
    }

    function handleOpenMap() {
        setOpenMap(true)
    }

     const handleCloseMap = () => {
        setOpenMap(false);
    };

    function handleOrder() {
        console.log(orderedProduct, total)
        const productList = orderedProduct.map(prod => {
            return {
                productId: prod["_id"],
                title: prod.title,
                price: prod.title,
                quantity: prod.quantity,
                shop: prod.shop,
            }
        })
        // axios.post('http://127.0.0.1:8000/order/new-order', {
            
        // })
    }

    useEffect(() => {
        let totalExp = 0
        orderedProduct.forEach(product => {
            const totalForEach = product.price * product.quantity;
            totalExp = totalExp + totalForEach
        })
        setTotal(totalExp)
    }, [orderedProduct])

    return (
        <Paper classes={{ root: cartStyles.paper }}>
            <div>
                <Dialog
                    fullScreen={true}
                    open={openMap}
                    onClose={handleCloseMap}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Select Your Shop's Exact Location"}</DialogTitle>
                    <DialogContent>
                        <div>
                            <ReactMapGL
                                {...viewport}
                                mapboxApiAccessToken={ mapboxApiKey}
                                onViewportChange={nextViewport => setViewport(nextViewport)}
                                mapStyle="mapbox://styles/mostafij163/cksalt6m652ig17qpge35l96v"
                                onClick={handleCoordinates}
                            >
                                <Marker
                                    latitude={location[1]} 
                                    longitude={location[0]}
                                >marker</Marker>
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
            <TableContainer>
                <Table sx={{ minWidth: 650, width: "100%" }} aria-label="caption table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Quantities</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Remove</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            orderedProduct.map(product => (
                                <TableRow key={product.title}>
                                    <TableCell>{product.title}</TableCell>
                                    <TableCell>{ product.quantity }</TableCell>
                                    <TableCell>{ product.price }</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleRemoveItem(product)}>
                                            <RemoveCircle color="error"/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>{ total }</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Autocomplete 
                classes={{ root: cartStyles.input }}
                id="location"
                style={{ width: "80%", margin: "auto", marginTop: "1.5rem" }}
                options={ locInfo }
                getOptionLabel={(option) => option.place_name}
                onChange={(event, value) => {
                    if (value) {
                        setLocation(value.geometry.coordinates)
                        console.log(value.geometry.coordinates)
                    }
                }}
                onClose={handleOpenMap}
                required={true}
                renderInput={(params) => <TextField
                    {...params}
                    value={location}
                    onChange={(event) => handleLocationChange(event)}
                    label="Select Shop Location"
                    variant="outlined"
                />}
            />
            <div style={{width: "80%", margin: "auto"}}>
                <Button
                    variant="contained"
                    color="primary"
                    classes={{ root: cartStyles["submit-btn"] }}
                    onClick={handleOrder}
                >
                    Place Order
                </Button>
            </div>
        </Paper>
    )
}