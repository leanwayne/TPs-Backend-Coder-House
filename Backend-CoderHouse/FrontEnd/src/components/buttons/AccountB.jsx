import React from 'react'
import {makeStyles, IconButton, Badge} from '@material-ui/core'
import AccountBoxIcon from '@material-ui/icons/AccountBox'

const useStyles = makeStyles((theme) => ({
    button: {
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(2),
    },
}))

const AccountB = () => {
    const classes = useStyles()

    return (
        <IconButton href="/SignIn" color="inherit" className={classes.button}>               
            <AccountBoxIcon/>
        </IconButton>    
    )

}
export default AccountB