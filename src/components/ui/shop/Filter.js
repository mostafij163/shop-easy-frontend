import React, { useState, } from "react"
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    FormControl,
    FormControlLabel,
    Checkbox,
    TextField,
    MenuItem,
    makeStyles,
    Button
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

const useStyle = makeStyles(theme => ({
    "btn-submit": {
        ...theme["submit-btn"],
        width: "17%",
        float: "right",
        margin: "2rem"
    }
}))

export default function Filter({
    category,
    productCategories,
    manufacturers,
    requestProducts
}) {
    const filterStyles = useStyle()
    const [filterCategory, setFilterCategory] = useState("");
    const [filterManufac, setFilterManuFac] = useState("")
    const [filterPrice, setFilterPrice] = useState(false);

    function handleFilterSubmit(event) {
        event.preventDefault();
        // TODO: 1. bulid query string
        // TODO: 2. send request 

        let query = {
            category: filterCategory,
            manufacturer: filterManufac,
            sort: filterPrice
        }

        requestProducts(category, query)
    }

    function returnFilter(category) {
        switch (category) {
            case "FOOD": category
                break;
            case "MEDICINE": category
                break;
            case "CLOTHANDSHOE": category
                break;
            default:
                break;
        }
    }

    return (
        <Accordion style={{ marginTop: "2rem" }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                    <Typography variant="h6">Filter <i className="fas fa-filter" style={{color: "#f50057"}}></i></Typography>
            </AccordionSummary>
            <AccordionDetails>
                <form onSubmit={handleFilterSubmit} style={{width:"100%"}}>
                    <FormControl component="fieldset">
                        <FormControlLabel
                            style={{ margin: "0 1rem", }}
                                value="price"
                                control={<Checkbox checked={filterPrice} onClick={function () {
                                    setFilterPrice(!filterPrice)
                                }} color="primary" />}
                                label="Price"
                                labelPlacement="end"
                        />
                        <TextField
                            style={{ margin: "0 1rem", width: "7rem", }}
                            select
                            label={category === "MEDICINE" ? "Group" : "Category"}
                            id="category"
                            value={filterCategory}
                            onChange={(event) => {
                                setFilterCategory(event.target.value)
                            }}
                            key={category}
                        >
                            {
                                productCategories.map(cat => {
                                    return <MenuItem
                                        key={cat}
                                        value={cat}
                                    >
                                        {
                                            cat
                                        }
                                    </MenuItem>
                                })
                            }
                        </TextField>
                        <TextField
                            style={{ margin: "0 1rem", width: "7rem", }}
                            select
                            label="Manufacturer"
                            id="category"
                            value={filterManufac}
                            onChange={(event) => {
                                setFilterManuFac(event.target.value)
                            }}
                        >
                            {
                                manufacturers.map(manufac => {
                                    return <MenuItem
                                        key={manufac}
                                        value={manufac}
                                    >
                                        {
                                            manufac
                                        }
                                    </MenuItem>
                                })
                            }
                        </TextField>
                        {
                            returnFilter(category)
                        }
                    </FormControl>
                    <Button
                        className={filterStyles["btn-submit"]}
                        color="primary"
                        variant="contained"
                        type="submit"
                    >
                        Filter Products
                    </Button>
                </form>
            </AccordionDetails>
        </Accordion>
    )
}