import React, {
    useState,
    Fragment,
    useContext,
} from "react";
import { useHistory } from "react-router-dom";
import {
    Button,
    Paper,
    TextField,
    TextareaAutosize,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core"
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { TimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import jwt from "jsonwebtoken"
import MainContext from "../../../store/main-context";

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
    const [dataSendingState, setDataSendingState] = useState(false)
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState([])
    const [category, setcategory] = useState('');
    const [openingHour, setOpeningHour] = useState(new Date().toLocaleTimeString());
    const [closingHour, setClosingingHour] = useState(new Date().toLocaleTimeString());
    const [description, setDescription] = useState('');
    
    const handleCategoryChange = (event) => {
        setcategory(event.target.value);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleLocationChange = (event) => {
        const cord = event.target.value.split(",");
        setLocation(cord)
        
        // {
            //     "coordinates": {
                //         "longitude": 90.3509005,
                //         "latitude": 23.7916585
                //     }
                // }
            }
            
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value)
    }
            
     const newShopFormSubmit = async (event) => {
         event.preventDefault();
         setDataSendingState(true)
         let res;
        try {
            res = await axios.post("http://127.0.0.1:8000/shop/new-shop", {
            name: title,
            owner: mainCtx.user.id,
            location: {
                coordinates: {
                    longitude: location[1],
                    latitude: location[0]
                }
            },
            shopCategory: category,
            description: description,
            openingHour: openingHour,
            closingHour: closingHour
        })
        } catch (err) {
            setDataSendingState(false)
         }
         setDataSendingState(false);
         if (res) {
             localStorage.setItem('shop', res.data)
             const shop = jwt.decode(res.data)
             if (res.status == 201) {
                history.push(`/shop/dashboard/${shop.sub}`)
            }
         }
    }
    
    return (
        <Fragment>
            <Paper classes={{ root: newShopStyles.paper }}>
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
                    <TextField
                        classes={{ root: newShopStyles.input }}
                        id="location"
                        type="text"
                        label="Select Shop Location" variant="outlined"
                        onChange={handleLocationChange}
                        style={{ width: "65%" }}
                        required={true}
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