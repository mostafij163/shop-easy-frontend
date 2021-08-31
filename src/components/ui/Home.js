import { useState, forwardRef, Fragment } from "react";
import { useHistory } from "react-router-dom";
import {
    Box,
    Grid,
    makeStyles,
    TextField,
    Button,
    Paper,
    Popper,
    Checkbox,
    FormGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from "@material-ui/core"
import Autocomplete from "@material-ui/lab/Autocomplete"
import FilterListIcon from '@material-ui/icons/FilterList';
import { useSpring, animated } from 'react-spring'
import axios from "axios"

const Fade = forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited();
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});


const useStyle = makeStyles(theme => ({
    addressInput: {
        width: "90%",
        margin: ".8rem",
    },
    button: {
        backgroundColor: theme.palette.primary.main,
        padding: ".96rem",
        float: "right",
        margin: ".8rem",
        color: theme.palette.secondary.main,
        display: "inline-block",
        "&:hover": {
            backgroundColor: theme.palette.primary.dark
        }
    },
    "filter-btn": {
        color: theme.palette.primary.main,
        padding: 0,
        margin: ".8rem",
    },
    paper: {
    border: '1px solid',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
}))

export default function Home() {
    const homeStyles = useStyle()
    const history = useHistory()
    const [anchorEl, setAnchorEl] = useState(null);
    const [area, setArea] = useState([])
    const [location, setLocation] = useState([])
    const [filter, setFilter] = useState({
        clothandshoe: true,
        medicine: true,
        food: true
    })

    const handleAreaChange = (event) => {
        const strings = event.target.value.split(" ");
        const trimedStrings = strings.map(str => str.trim())
        const encodedString = trimedStrings.join("%20")

        axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedString}.json?access_token=   &country=BD`
        ).then(res => {
            if (res.status == 200) {
                setArea(res.data.features)  
            }
        }).catch(err => {
            alert(err.message)
        })
    }

    // function handleCategoryChange(event) {
    //     const existingCategory = shopCategory.find(cat => cat === event.target.value)
    //     if(!existingCategory) 
    // }

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    function handleAreaFormSubmit(event) {
        event.preventDefault();
        const url = `http://127.0.0.1:8000/shop/near-me?coords=${location[0]},${location[1]}&categories=${filter.clothandshoe ? 'CLOTHANDSHOE' : null},${filter.food ? "FOOD" : null},${filter.medicine ? "MEDICINE" : null}`

        axios.get(url).then(res => {
            if (res.status == 200) {
                history.push('/shops', {shops: res.data})
            }
        }).catch(err => {
            alert(err.message)
        })
    }

    const open = Boolean(anchorEl);
    const id = open ? 'spring-popper' : undefined;
    return (
        <Fragment>
            <Box sx={{
                width: "70%",
                backgroundColor: "palette.secondary.dark",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                height: "5rem",
                margin: "0 auto",
            }}>
                    <form autoComplete="off" onSubmit={handleAreaFormSubmit}>
                    <Grid container>
                        <Grid item xs={8} md={7}>
                            <Autocomplete 
                                classes={{ root: homeStyles.addressInput }}
                                id="location"
                                options={ area }
                                getOptionLabel={(option) => option.place_name}
                                onChange={(event, value) => {
                                    if (value) {
                                        setLocation(value.geometry.coordinates)
                                    }
                                }}
                                required={true}
                                renderInput={(params) => <TextField
                                    {...params}
                                    value={location}
                                    onChange={(event) => handleAreaChange(event)}
                                    label="Enter your area"
                                    variant="outlined"
                                />}
                            />
                        </Grid>
                        <Grid item xs={2}>       
                            <Button
                                className={homeStyles["filter-btn"]}
                                size="large"
                                aria-describedby={id}
                                type="button"
                                onClick={handleClick}
                            >
                                <FilterListIcon style={ {fontSize: "3.5rem"}}/>
                            </Button>
                            <Popper id={id} open={open} anchorEl={anchorEl} transition>
                                {({ TransitionProps }) => (
                                <Fade {...TransitionProps}>
                                    <Paper>
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend">Select Shop Category</FormLabel>
                                                <FormGroup aria-label="position">
                                                    <FormControlLabel
                                                        value="CLOTHANDSHOE"
                                                        control={<Checkbox
                                                            color="primary"
                                                            checked={filter.clothandshoe}
                                                            onChange={() => {
                                                                setFilter({...filter, clothandshoe: !filter.clothandshoe})
                                                            }}
                                                        />}
                                                        label="Cloth And Shoe"
                                                        labelPlacement="end"
                                                    />
                                                    <FormControlLabel
                                                        value="MEDICINE"
                                                        control={<Checkbox
                                                            color="primary"
                                                            checked={filter.medicine}
                                                        />}
                                                        label="Medicine"
                                                        labelPlacement="end"
                                                        onChange={() => {
                                                            setFilter({...filter, medicine: !filter.medicine})
                                                        }}
                                                    />
                                                    <FormControlLabel
                                                        value="FOOD"
                                                        control={<Checkbox
                                                            color="primary"
                                                            checked={filter.food}
                                                        />}
                                                        label="Food"
                                                        labelPlacement="end"
                                                        onChange={() => {
                                                            setFilter({ ...filter, food: !filter.food})
                                                        }}
                                                    />
                                            </FormGroup>
                                        </FormControl>   
                                    </Paper>
                                </Fade>
                                )}
                            </Popper>
                        </Grid>
                        <Grid item xs={5} md={3}>
                            <Button
                                type="submit"
                                variant="contained"
                                classes={{root: homeStyles.button}}
                            >
                                Search Shop
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Fragment>
    )
}