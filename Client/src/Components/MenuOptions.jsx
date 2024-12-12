import { Dialog, Slide } from '@mui/material'
import { useContext } from 'react'
import { userDetailsContext } from '../Contexts/userDataContext'

export default function MenuOptions() {
    const {openMenu, setOpenMenu} = useContext(userDetailsContext)
    return (
        <div className="menuWrapper">
            <Dialog 
                open={openMenu}
                onClose={(event, reason) => {
                    if(reason === 'backdropClick' || reason === 'escapeKeyDown') {
                        setOpenMenu(false)
                    }
                }}
                disableScrollLock
                // PaperProps={}
                TransitionComponent={Slide}
                TransitionProps={{direction: 'right'}}
            >

            </Dialog>
        </div>
    )
}