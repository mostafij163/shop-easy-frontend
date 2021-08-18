import React, { useState, useContext} from "react"
import { useHistory } from "react-router";
import {
    Paper,
    TextField,
    Button,
    makeStyles,
} from "@material-ui/core";
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from "axios";
import MainContext from "../../../store/main-context";

const useStyle = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    textField: {
        width: '25ch',
    },
    paper: {
        maxWidth: "30rem",
        height: "45vh",
        marginTop: "16%",
        margin: "auto",
        boxShadow: "0px 2px 1px -1px rgb(233 30 99 / 100%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)"
    },
    "login-btn": {
        float: "right",
        padding: "10px 19px",
        margin: "2rem",
        boxShadow: "none",
    },
    input: {
        width: "-webkit-fill-available",
        margin: "2rem 2rem 0rem 2rem"
    }
}))

export default function Login() {
    const history = useHistory()
    const mainCtx = useContext(MainContext)
    const loginStyles = useStyle()
    const [values, setValues] = useState({
    password: '',
    showPassword: false,
    });
    const [email, setEmail] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = async (event) => {
        event.preventDefault();
    };

    async function loginFormSubmit(event) {
        event.preventDefault()
        try {
            const res = await axios.post('http://127.0.0.1:8000/seller/auth/login', {
                email: email, password: values.password
            })
            console.log(res)
            if (res) {
                if (res.status == 201) {
                    mainCtx.handleUserJwt(res.data)
                    history.push('/')
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <Paper classes={{root: loginStyles.paper}}>
                <form onSubmit={loginFormSubmit}>
                    <TextField
                        classes={{ root: loginStyles.input }}
                        id="email" type="email"
                        label="Enter Your Email"
                        variant="outlined"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <FormControl className={clsx(loginStyles.margin, loginStyles.textField), loginStyles.input} variant="outlined">
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                id="password"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                endAdornment={
                    <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                    >
                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                    </InputAdornment>
                }
                labelWidth={70}
                />
            </FormControl>
                    <Button
                        variant="contained"
                        type="submit"
                        color="primary"
                        classes={{root: loginStyles["login-btn"]}}
                    >
                        Login
                    </Button>
                </form>
            </Paper>
        </div>
    )
}