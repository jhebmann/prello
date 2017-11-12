import React from 'react'
import { Button, FormControl } from 'react-bootstrap'
import axios from 'axios'
import url from '../../../config'
import Auth from '../../Auth/Auth.js'

class Attachment extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            popup: this.props.popup,
            card: this.props.card,
            title: '',
            file: null,
            imagePreviewUrl: ''
        }

        this.socket = this.props.io
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleNewFile = this.handleNewFile.bind(this)
        this.onClickAddAttachment = this.onClickAddAttachment.bind(this)
    }

    render(){
        let $imagePreview = null
        if (this.state.imagePreviewUrl) {
          $imagePreview = <img id="attachmentImgPreview" src={this.state.imagePreviewUrl} alt={this.state.title}/>
        } else {
          $imagePreview = ""
        }
        return(
            <div className="AttachmentDiv">
                <hr className="skylightHr"/>
                <div className="attachmentForm">
                    <FormControl type="file" name="file" placeholder="Attachment" onChange={this.handleNewFile} className="attachmentFormSpace"/>
                    <FormControl type="text" name="title" placeholder="Title" onChange={this.handleInputChange} className="attachmentFormSpace attachmentFormMedium"/>
                    <Button id='cardAttachment' className="attachmentFormSpace" bsStyle="primary" onClick={this.onClickAddAttachment} disabled={'undefined' === typeof this.state.file}>Add</Button>
                    {$imagePreview}
                </div>
            </div>
        )
    }
    
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if ('undefined' === typeof this.state.file) this.onClickAddAttachment()
        }
    }
    
    handleInputChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleNewFile = (e) => {
        const self = this;
        const reader = new FileReader();
        const file = e.target.files[0];
    
        reader.onloadend = function(upload) {
          self.setState({
            file: file,
            imagePreviewUrl: reader.result
          });
        }
    
        reader.readAsDataURL(file);
    }
    
    onClickAddAttachment() {
        let formData = new FormData()
        formData.append("attachment", this.state.file)
        formData.append("postedBy", Auth.getUserID())
        formData.append("title", this.state.title.trim())
        axios.post(url.api + 'attachment/card/' + this.props.card.state.cardInfos._id, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }, url.config).then((response) => {
            //this.socket.emit('newAttachmentServer', response.data)
            this.addAttachment(response.data)
        }).catch((error) => {
            alert('An error occured when adding the attachment')
        })
    }

    addAttachment(attachment) {
        let newCardInfos = this.state.card.state.cardInfos
        newCardInfos.attachments.push(attachment)
        this.state.card.setState({cardInfos: newCardInfos})
        this.state.popup.setState({cardInfos: newCardInfos})
        this.setState({
            attachment: undefined,
            title: ""
        })
        console.log(this.state.imagePreviewUrl)
    }
}

export default Attachment
