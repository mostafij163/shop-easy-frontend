import React, { Fragment, useState, useEffect } from "react";
import {
    Paper,
    makeStyles,
    TextField,
    Button,
    TextareaAutosize,
} from "@material-ui/core"
import axios from "axios"

const useStyle = makeStyles(theme => ({
    paper: {
       ...theme.paper
    },
    input: {
        width: "58%",
        minWidth: "10rem",
        margin: "2rem 2rem auto 2rem",
    },
    "submit-btn": {
        ...theme["submit-btn"]
    },
    "btn-container": {
        ...theme["btn-container-full"]
    }
}))

export default function AddProduct({ shopCategory }) {
    const addProductStyles = useStyle()
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState(1)
    const [manufacturer, setManufacturer] = useState("")
    const [category, setCategory] = useState("");
    const [color, setColor] = useState([])
    const [availableSize, setAvailableSize] = useState([])
    const [description, setDescription] = useState("")
    const [userJwt, setUserJwt] = useState("")
    const [shopJwt, setShopJwt] = useState("")

    useEffect(() => {
        const userToken = localStorage.getItem('user')
        if (userToken) {
        setUserJwt(userToken)
        }
        const shopToken = localStorage.getItem('shop')
        if (shopToken) {
        setShopJwt(shopToken)
        }
    }, [])

    const handleAddProductForm = (e) => {
        e.preventDefault();
        const data = {
            title,
            price,
            manufacturer,
            category,
            color,
            availableSize,
            description
        }
        axios.post(
            `http://127.0.0.1:8000/shop/product`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${userJwt}`,
                    'X-shop-jwt': `Bearer ${shopJwt}` 
                }
            }
        ).then(res => {
            console.log(res)
        })
    }

    return (
        <Fragment>
            <Paper classes={{ root: addProductStyles.paper }}>
                <form onSubmit={handleAddProductForm}>
                    <TextField
                        className={addProductStyles.input}
                        id="title"
                        type="text"
                        label="Product Title" variant="outlined"
                        required
                        onChange={(e) => {
                            setTitle(e.target.value)
                        }}
                        value={title}
                    />
                    <TextField
                        style={{width: "26%", minWidth: "6rem"}}
                        className={addProductStyles.input}
                        id="price"
                        type="number"
                        label="Set Price" variant="outlined"
                        required
                        onChange={(e) => {
                            setPrice(e.target.value)
                        }}
                        value={price}
                    />
                    <TextField
                        className={addProductStyles.input}
                        id="manufacturer"
                        type="text"
                        label="Manufacturer" variant="outlined"
                        required
                        onChange={(e) => {
                            setManufacturer(e.target.value)
                        }}
                        value={manufacturer}
                    />
                    <TextField
                        style={{width: "26%", minWidth: "6rem"}}
                        className={addProductStyles.input}
                        id="category"
                        type="text"
                        label="Category Eg. Shirt, Paracetamol, fastfood" variant="outlined"
                        required
                        onChange={(e) => {
                            setCategory(e.target.value)
                        }}
                        value={category}
                    />
                    {
                        shopCategory === "CLOTHANDSHOE" ?
                            <Fragment>
                                <TextField
                                    style={{width: "26%", minWidth: "6rem"}}
                                    className={addProductStyles.input}
                                    id="size"
                                    type="text"
                                    label="Available Sizes" variant="outlined"
                                    onChange={(e) => {
                                        const values = e.target.value.split(",")
                                        setAvailableSize(values)
                                    }}
                                    value={availableSize}
                                />
                                <TextField
                                    style={{width: "26%", minWidth: "6rem"}}
                                    className={addProductStyles.input}
                                    id="color"
                                    type="text"
                                    label="Colors" variant="outlined"
                                    onChange={(e) => {
                                        const values = e.target.value.split(",")
                                        setColor(values)
                                    }}
                                    value={color}
                                />
                            </Fragment> : null
                    }
                    <TextareaAutosize
                        style={{ width: "50%", margin: "2rem 2rem 0rem 2rem" }}
                        minRows={3}
                        maxRows={3}
                        placeholder="About the product"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value)
                        }}
                    ></TextareaAutosize>
                    <div className={addProductStyles["btn-container"]}>
                        <Button variant="contained" type="submit" className={ addProductStyles["submit-btn"]} color="primary">
                            Create
                        </Button>
                    </div>
                </form>
            </Paper>
        </Fragment>
    )
}