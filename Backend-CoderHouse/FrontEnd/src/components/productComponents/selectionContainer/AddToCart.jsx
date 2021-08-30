import React, {useState, useEffect, useContext} from 'react'
import { makeStyles, Button, Dialog, Slide, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@material-ui/core'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import {AuthContext} from '../../contexts/AuthContext'

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 110,
    },
    button: {
        marginTop: theme.spacing(2),
    },
    extendedIcon: {
        marginLeft: theme.spacing(1),
    },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props}/>
});

const AddToCart = ({color, products, quantity}) => {
    const classes = useStyles()
    const [product, setProduct] = useState({})
    const [userLogged, setUserLogged] = useState(false)
    const [quantityError, setQuantityError] = useState(false)
    const {logged} = useContext(AuthContext)

    console.log("un producto", product)

    const notify = () => toast.dark(`${product.nombre} x${quantity} added to the Cart!`)
  
    useEffect(() => {
        if(color) setProduct(products.find(p => p.color === color))
    }, [color])

    const addProduct = () => {
        if(logged){
            const requestOptions = {
                method: 'PUT',
                headers: {'Accept': 'application/json','Content-Type': 'application/json'},
                credentials: 'include',
                body: JSON.stringify({product:{codigoP:product.codigoP, id:product._id, color:color, stock:product.stock}, cantidad:quantity})
            }
            fetch('http://localhost:8080/cart/agregar', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log('data--------------', data)
                if(data === 'quantity error')setQuantityError(true)
                notify()
            })
            .catch(err =>{
                  console.log('ERROR', err)
            })
        }else {
            setUserLogged(true)
        }     
    }
      
    const handleClose = () => {
        setUserLogged(false);
        setQuantityError(false)
    }

    return (
        <div>
            <Button 
                variant='contained'
                disabled={color === 'readonly' || !color || product === undefined || product.stock === 0? true : false}
                size='large'
                color='primary'
                className={classes.button}
                onClick={addProduct}
            >
                Add to Cart
                {<ShoppingCartIcon className={classes.extendedIcon}/>}
            </Button>
            {userLogged &&(
                <Dialog
                    TransitionComponent={Transition}
                    open={userLogged}
                    onClose={handleClose}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >                              
                    <DialogTitle id='alert-dialog-title'>{'You are not logged in.'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id='alert-dialog-description'>          
                            The shopping cart it's only available for registered users. Please log in and try again.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color='primary' href={'/SignIn'}>
                            Go to Log in page.
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            {quantityError &&(
                <Dialog
                    open={quantityError}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                >                              
                    <DialogTitle>{"Can't add more of this product"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>                           
                          you already added the maximum of the stock.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" href={"/cart"}>
                            Go to shopping cart.
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover 
            />
        </div>
    )
}

export default AddToCart