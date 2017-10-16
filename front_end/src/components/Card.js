import React from 'react';
import { Button,Thumbnail,ProgressBar } from 'react-bootstrap';
const Timestamp = require('react-timestamp');

class Card extends React.Component{

    render(){
        let descr;
        if (typeof this.props.description !== 'undefined' && this.props.description.trim().length > 0){
            descr = this.props.description
        }else {
            descr = "No description"
        }
        return(
            <Thumbnail>
                <ProgressBar bsStyle="danger" now={100} />
                <h3>{this.props.titleCard}</h3>
                <p> {descr} </p>
                <p><Timestamp time={this.props.createdAt} precision={1} /></p>
                
                <Button bsStyle="primary">Button</Button>&nbsp;
                <Button bsStyle="default">Button</Button>
            </Thumbnail>
            );
        }
}

export default Card;
