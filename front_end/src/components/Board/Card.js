import React from 'react'
import { Thumbnail, ProgressBar } from 'react-bootstrap'
import SkyLight from 'react-skylight'
import Popup from './Popup.js'


class Card extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            title: this.props.title ? this.props.title : undefined,
            description: this.props.description ? this.props.description : undefined,
            date: this.props.date ? this.props.date : undefined,
            labels: this.props.labels ? this.props.labels : undefined,
            listTitle: this.props.listTitle ? this.props.listTitle : undefined
        }
    }

    render(){

        const bigPopup = {
            width: '70%',
            height: '100%',
            marginTop: '-19%',
            marginLeft: '-35%',
            overflow: 'hidden',
            overflowY: 'auto'
        }
        
        return(
            <div>
                <Thumbnail onClick={() => this.customDialog.show()} className='card' >
                    <ProgressBar bsStyle="danger" now={100} />
                    <h4>{this.state.title}</h4>
                    <p> {this.state.description} </p>
                </Thumbnail>
                
                <SkyLight dialogStyles={bigPopup} hideOnOverlayClicked ref={ref => this.customDialog = ref} title={this.state.title} propsi={this.state.description}>
                    <Popup state={this.state}/>
                </SkyLight>                               
            </div>
            
        )
    }
}

export default Card