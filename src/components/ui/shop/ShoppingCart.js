import { useEffect, useState, } from "react";
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
} from "@material-ui/core";
import { RemoveCircle } from "@material-ui/icons";

const useStyle = makeStyles(() => ({
    paper: {
        height: "auto",
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

    useEffect(() => {
        let totalExp = 0
        orderedProduct.forEach(product => {
            const totalForEach = product.price * product.quantity;
            totalExp = totalExp + totalForEach
        })
        setTotal(totalExp)
    }, [orderedProduct])

    return (
        <Paper classes={{root: cartStyles.paper}}>
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
            <div style={{width: "80%", margin: "auto"}}>
                <Button
                    variant="contained"
                    color="primary"
                    classes={{ root: cartStyles["submit-btn"] }}
                >
                    Place Order
                </Button>
            </div>
        </Paper>
    )
}