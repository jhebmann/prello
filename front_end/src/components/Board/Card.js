import React from 'react'
import { Thumbnail, ProgressBar } from 'react-bootstrap'
import SkyLight from 'react-skylight'


class Card extends React.Component{

    render(){
        let descr;
        if (typeof this.props.description !== 'undefined' && this.props.description.trim().length > 0){
            descr = this.props.description
        }else {
            descr = "No description"
        }
        return(
            <Thumbnail onClick={() => this.simpleDialog.show()} className='card' >
                <ProgressBar bsStyle="danger" now={100} />
                <h4>{this.props.titleCard}</h4>
                <p> {descr} </p>
         <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref} title="Hi, I'm a simple modal">
          Hello, I dont have any callback.
        </SkyLight>                               
            </Thumbnail>
            
        )
    }
}

export default Card;
