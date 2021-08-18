import React from "react";
import {
    Box,
    makeStyles,
    TextField,
    Button,
    Paper,
} from "@material-ui/core"
import FilterListIcon from '@material-ui/icons/FilterList';
import Popper from '@material-ui/core/Popper';
import { useSpring, animated } from 'react-spring'
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
// import Header from "./Header";

const Fade = React.forwardRef(function Fade(props, ref) {
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
        width: "50%",
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
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'spring-popper' : undefined;
    return (
        <React.Fragment>
            {/* <Header/> */}
            <Box sx={{
                width: "70%",
                backgroundColor: "palette.secondary.dark",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                height: "5rem",
                margin: "0 auto",
            }}>
                    <form autoComplete="off">
                    <TextField
                        id="area"
                        label="Enter Your Area"
                        variant="outlined"
                        classes={{root: homeStyles.addressInput}}
                    />
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
                                            control={<Checkbox color="primary" />}
                                            label="Cloth And Shoe"
                                            labelPlacement="end"
                                        />
                                        <FormControlLabel
                                            value="MEDICINE"
                                            control={<Checkbox color="primary" />}
                                            label="Medicine"
                                            labelPlacement="end"
                                        />
                                        <FormControlLabel
                                            value="FOOD"
                                            control={<Checkbox color="primary" />}
                                            label="Food"
                                            labelPlacement="end"
                                        />
                                    </FormGroup>
                                </FormControl>   
                            </Paper>
                        </Fade>
                        )}
                    </Popper>
                    <Button
                        type="submit"
                        variant="contained"
                        classes={{root: homeStyles.button}}
                    >
                        Search Shop
                    </Button>
                </form>
            </Box>
        </React.Fragment>
    )
}