import React from "react"
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
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { Fragment } from "react";

const shopCategory = [1];

export default function Filter({category, productCategories, manufacturers}) {
    const [filterCategory, setFilterCategory] = React.useState("");
    const [filterPrice, setFilterPrice] = React.useState(false);

    manufacturers = ["gentle park", "yellow", "arong"]
    const prodCats = Array.from(productCategories);
    const manufacs = Array.from(manufacturers);
    
    function handleFilterChange(e) {
        setFilterCategory(e.target.value)
    }

    return (
        <Accordion style={{marginTop: "2rem"}}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                    <Typography variant="h6">Filter <i className="fas fa-filter" style={{color: "#f50057"}}></i></Typography>
            </AccordionSummary>
            <AccordionDetails>
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
                    {
                        shopCategory.map(() => {
                            console.log(prodCats)
                            switch (category) {
                                case "FOOD": category
                                    return (
                                        <TextField
                                            style={{ margin: "0 1rem", width: "7rem", }}
                                            select
                                            label="Category"
                                            id="category"
                                            value={filterCategory}
                                            onChange={handleFilterChange}
                                            key={category}
                                        >
                                            {
                                                prodCats.map(cat => {
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
                                    )
                                case "MEDICINE": category
                                    return (
                                        <TextField
                                            style={{ margin: "0 1rem", width: "7rem",}}
                                                select
                                                label="Group"
                                            id="category"
                                            value={filterCategory}
                                            onChange={handleFilterChange}
                                        >
                                            {
                                                prodCats.map(cat => {
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
                                    )
                                case "CLOTHANDSHOE": category
                                    return (
                                        <Fragment>
                                            <TextField
                                                style={{ margin: "0 1rem", width: "7rem",}}
                                                    select
                                                    label="Category"
                                                id="category"
                                                value={filterCategory}
                                                onChange={handleFilterChange}
                                            >
                                                {
                                                    prodCats.map(cat => {
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
                                                style={{ margin: "0 1rem", width: "7rem",}}
                                                    select
                                                    label="Manufacturer"
                                                id="category"
                                                value={filterCategory}
                                                onChange={handleFilterChange}
                                            >
                                                {
                                                    manufacs.map(manufac => {
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
                                        </Fragment>
                                    )
                                default:
                                    break;
                            }
                        })
                    }

                    {/* <TextField
                        style={{ margin: "0 1rem", width: "7rem",}}
                            select
                            label="Category"
                        id="category"
                        value={filterCategory}
                        onChange={handleFilterChange}
                        >
                            <MenuItem value="veg">Vegetarian</MenuItem>
                            <MenuItem value="nonveg">Non Vegetarian</MenuItem>
                            <MenuItem value="fastfood">Fast Food</MenuItem>
                            <MenuItem value="chinese">Chinese</MenuItem>
                            <MenuItem value="bangla">Bangladesh</MenuItem>
                            <MenuItem value="rice">Rice Dishes</MenuItem>
                        </TextField> */}
                </FormControl>
            </AccordionDetails>
        </Accordion>
    )
}