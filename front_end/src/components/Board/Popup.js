import React from 'react'
import { Button } from 'react-bootstrap'
import SkyLight from 'react-skylight'


class Popup extends React.Component{
    constructor(props){
        super(props)
        this.state = this.props.state
        console.log(this.state)
    }

    render(){
        
        return(
            <div className="popup">
                <div className="popupLeft">
                    <div className="popupList"> In list {this.state.listTitle} </div>
                    <div className="popupMembers"> members </div>
                    <div className="popupLabels"> labels </div>
                    <div className="popupDescritpion"> description </div>
                    <div className="popupChecklists"> checklists </div>
                    <div className="popupComments"> comments </div>
                    <div className="popupActivities"> activities </div>
                </div>
                <div className="popupRight">
                    <div className="popupAdd"> 
                        <h3>Add</h3>
                        <Button className='popupButton' onClick={''}>Members</Button>
                        <Button className='popupButton' onClick={''}>Labels</Button>
                        <Button className='popupButton' onClick={''}>Checklists</Button>
                        <Button className='popupButton' onClick={''}>Due date</Button>
                        <Button className='popupButton' onClick={''}>Members</Button>
                        <Button className='popupButton' onClick={''}>Attachment</Button>
                    </div>
                    <div className="popupActions">
                        <h3> Action </h3>
                        <Button className='popupButton' onClick={''}>Move</Button>
                        <Button className='popupButton' onClick={''}>Delete</Button>

                    </div>
                </div>

            </div>
        )
    }
}

export default Popup
