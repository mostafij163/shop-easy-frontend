import React, { useState, } from 'react';
import { useHistory } from 'react-router';
import clsx from 'clsx';
import { makeStyles,} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import {Button, Typography, Paper } from "@material-ui/core"
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from "axios"

const useStyles = makeStyles((theme) => ({
    root: {
        width: "50vw",
        marginTop: "10%",
        margin: "auto",
        height: "360px",
        boxShadow: "0px 2px 1px -1px rgb(233 30 99 / 100%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)"
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '25ch',
    },
  "sign-btn": {
        padding: "10.5px 26px", 
        margin: "2rem 2rem",
        float: "right"
    },
    input: {
        width: "-webkit-fill-available",
        margin: "1rem 1rem 0rem 1rem",
        height: "3.1rem"
    }
}));

export default function Signup() {
    const classes = useStyles();
    const history = useHistory()
    const [email, setEmail] = useState("")
    const [name, setName] = useState("");
    const [nid, setNid] = useState("")
    const [password, setpassword] = useState({
    confirmPassword: '',
    password: '',
    showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setpassword({ ...password, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setpassword({ ...password, showPassword: !password.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }

    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const handleNidChange = (event) => {
        setNid(event.target.value)
    }

    async function signupFormSubmit(event) {
        event.preventDefault()
        let res;
        let data = {
            email,
            name,
            nid,
            password: password.password,
            confirmPassword: password.confirmPassword
        }
        try {
            res = await axios.post('http://127.0.0.1:8000/seller/auth/registration', data)
            console.log(res)
            if (res) {
                if (res.status == 201) {
                    localStorage.setItem('user', res.data)
                    history.push('/')
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

// activeStatus: false
// aud: "customer"
// exp: 1630248922
// iat: 1628952922
// name: "Mostafijur Rahman"

    return (
    <Paper className={classes.root}>
        <form onSubmit={signupFormSubmit}>
            <TextField
                className={classes.input}
                variant="outlined"
                    label="Email"
                    value={email}
                    onChange={handleEmailChange}
                />
            <TextField
                className={classes.input}
                variant="outlined"
                    label="Name"
                    value={name}
                    onChange={handleNameChange}
                />
                <TextField
                className={classes.input}
                variant="outlined"
                    label="NID"
                    value={nid}
                    onChange={handleNidChange}
                />
            <FormControl className={clsx(classes.margin, classes.textField), classes.input} variant="outlined">
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                id="password"
                type={password.showPassword ? 'text' : 'password'}
                value={password.password}
                onChange={handleChange('password')}
                endAdornment={
                    <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                    >
                        {password.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                    </InputAdornment>
                }
                labelWidth={70}
                />
            </FormControl>
            <FormControl className={clsx(classes.margin, classes.textField), classes.input} variant="outlined">
                <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                <OutlinedInput
                id="confirm-password"
                type={password.showPassword ? 'text' : 'password'}
                value={password.confirmPassword}
                onChange={handleChange('confirmPassword')}
                endAdornment={
                    <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                    >
                        {password.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                    </InputAdornment>
                }
                labelWidth={70}
                />
            </FormControl>
            <Button
                variant="contained"
                    color="primary"
                    type="submit"
                className={classes["sign-btn"]}
                to="/sign-up"
            >
                <Typography variant="h7">Sign Up</Typography>
            </Button>
        </form>
    </Paper>
    );
    }
