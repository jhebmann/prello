import React from 'react';
import { Button,Thumbnail,ProgressBar } from 'react-bootstrap';

class Card extends React.Component{

    render(){
        return(
            <Thumbnail >
                    <ProgressBar bsStyle="danger" now={100} />
                    <h4>{this.props.title_card}</h4>
                    <p>{this.props.description}</p>
                    <p>{this.props.date}</p>
                    <Button bsStyle="primary">Button</Button>&nbsp;
                    <Button bsStyle="default">Button</Button>
            </Thumbnail>
            );
        }
}

export default Card;