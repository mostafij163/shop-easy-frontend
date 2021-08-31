import React, {
    useState,
    Fragment,
    useContext,
    useEffect
} from "react";
import { useHistory } from "react-router-dom";
import ReactMapGL, { Marker } from 'react-map-gl';
import {
    Button,
    Paper,
    TextField,
    TextareaAutosize,
    makeStyles,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
// import jwt from "jsonwebtoken"
import Autocomplete from '@material-ui/lab/Autocomplete';
import MainContext from "../../../store/main-context";
import { mapboxApiKey } from "../../../store/map-box";

const useStyle = makeStyles(theme => ({
    paper: {
        ...theme.paper
    },
    input: {
        width: "65%",
        minWidth: "10rem",
        margin: "2rem 2rem 0rem 2rem",
    },
    select: {
        padding: "1rem",
    },
    "form-root": {
        width: "10rem",
        margin: "2rem 2rem 0rem 2rem",
    },
    "form-label": {
        marginLeft: "12px",
        lineHeight: 0,
    },
    "submit-btn": {
        ...theme["submit-btn"]
    },
    "btn-container": {
        ...theme["btn-container-full"],
    },
    "time-picker": {
        width: "8rem",
        padding: ".1rem",
        margin: "2rem 2rem 0rem 2rem",
    }
}))


export default function CreateNewShop() {
    const newShopStyles = useStyle();
    const mainCtx = useContext(MainContext)
    const history = useHistory()
    const [userJwt, setUserJwt] = useState('');
    const [dataSendingState, setDataSendingState] = useState(false)
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState([])
    const [locInfo, setLocInfo] = useState([])
    const [category, setcategory] = useState('');
    const [openingHour, setOpeningHour] = useState(new Date().toLocaleTimeString());
    const [closingHour, setClosingingHour] = useState(new Date().toLocaleTimeString());
    const [description, setDescription] = useState('');
    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: 23.7338028,
        longitude: 90.3814551,
        zoom: 12
    });
    const [openMap, setOpenMap] = useState(false);

    useEffect(() => {
        setViewport({
            width: "100vw",
            height: "100vh",
            latitude: location[1],
            longitude: location[0],
            zoom: 15
        })
    }, [location])

    useEffect(() =>{
        const userToken = localStorage.getItem('user')
        if (userToken) {
            setUserJwt(userToken)
        }
    }, [])

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

    const handleCategoryChange = (event) => {
        setcategory(event.target.value);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }
            
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value)
    }
            
     const newShopFormSubmit = async (event) => {
         event.preventDefault();
         if (userJwt) {
            setDataSendingState(true)
            let res;
            try {
                res = await axios.post("http://127.0.0.1:8000/shop/new-shop", {
                name: title,
                owner: mainCtx.user.id,
                location: {
                    coordinates: [location[0], location[1]]
                },
                shopCategory: category,
                description: description,
                openingHour: openingHour,
                closingHour: closingHour
                }, {
                    headers: {
                    Authorization: `Bearer ${userJwt}`
                }
            })
            } catch (err) {
                setDataSendingState(false)
            }
            setDataSendingState(false);
            if (res) {
                localStorage.setItem('shop', res.data)
                if (res.status == 201) {
                    history.push(`/my-shops`)
                }
            }
        }
    }
    
    return (
        <Fragment>
            <Paper classes={{ root: newShopStyles.paper }}>
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
                <form onSubmit={newShopFormSubmit}>
                    <TextField
                        className={newShopStyles.input}
                        id="name"
                        type="text"
                        label="Enter Shop Title" variant="outlined"
                        value={title}
                        onChange={handleTitleChange}
                        required={true}
                    />
                    <Autocomplete 
                        classes={{ root: newShopStyles.input }}
                        id="location"
                        style={{ width: "65%" }}
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
                    <FormControl className={ newShopStyles["form-root"]}>
                        <InputLabel id="category">Shop Category</InputLabel>
                        <Select
                            classes={{select: newShopStyles.select}}
                            variant="outlined"
                            labelId="category"
                            id="category"
                            value={category}
                            label="Shop Category"
                            onChange={handleCategoryChange}
                            required={true}
                        >
                            <MenuItem value="CLOTHANDSHOE">Shoe And Clothing</MenuItem>
                            <MenuItem value="MEDICINE">Medicine</MenuItem>
                            <MenuItem value="FOOD">Food</MenuItem>
                        </Select>
                    </FormControl>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <TimePicker
                            className={newShopStyles["time-picker"]}
                            autoOk
                            label="Select Opening Hour"
                            value={openingHour}
                            onChange={setOpeningHour}
                        />
                        <TimePicker
                            className={newShopStyles["time-picker"]}
                            autoOk
                            label="Select Closing Hour"
                            value={closingHour}
                            onChange={setClosingingHour}
                        />
                    </MuiPickersUtilsProvider>
                    <TextareaAutosize
                        style={{ width: "50%", margin: "2rem 2rem 0rem 2rem" }}
                        minRows={3}
                        maxRows={3}
                        placeholder="Say something about your shop"
                        value={description}
                        onChange={handleDescriptionChange}
                    ></TextareaAutosize>
                    <div className={newShopStyles["btn-container"]}>
                        <Button
                            variant="contained"
                            type="submit"
                            className={newShopStyles["submit-btn"]} color="primary"
                            disabled={dataSendingState}        
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </Paper>
        </Fragment>
    )
}