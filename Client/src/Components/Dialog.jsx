import { Dialog, DialogTitle, DialogContent, DialogActions, Slide } from "@mui/material"
import PropTypes from 'prop-types'

export default function DialogComponent ({ open, setOpen, title, content, func}) {
    return (
        <Dialog 
            PaperProps={{
                style: {
                    width: '30%', 
                    height: 'fit-content',
                    ...window.innerWidth <= 768 && {width: '50%'},
                    ...window.innerWidth <= 425 && {width: '80%'},
                    ...window.innerWidth <= 375 && {width: '95%'},
                }
            }}
            open={open}
            TransitionComponent={Slide}
            TransitionProps={{direction: 'up'}}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{content}</DialogContent>
            <DialogActions>
                <button style={{width: '70px', padding: '2px', cursor: 'pointer'}} onClick={func}>Change</button>
                <button style={{width: '70px', padding: '2px', cursor: 'pointer'}} onClick={ () => setOpen(false)}>Cancel</button>
            </DialogActions>
        </Dialog>

    )
}

DialogComponent.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.string,
    func: PropTypes.func
}