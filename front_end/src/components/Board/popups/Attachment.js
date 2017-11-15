import React from 'react'
import { Button, FormControl } from 'react-bootstrap'
import axios from 'axios'
import url from '../../../config'
import Auth from '../../Auth/Auth.js'
const Dropbox = require('dropbox')

class Attachment extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            popup: this.props.popup,
            card: this.props.card,
            title: '',
            cardId: this.props.card.state.cardInfos._id,
            file: null,
            imagePreviewUrl: '',
            dropbox: this.props.dropbox
        }

        this.socket = this.props.io
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleNewFile = this.handleNewFile.bind(this)
        this.onClickAddAttachment = this.onClickAddAttachment.bind(this)
        this.dropboxBegin = this.dropboxBegin.bind(this)
    }

    componentDidMount = () => {
        this.dropboxBegin()
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({dropbox: nextProps.dropbox})
    }

    render(){
        let filesList = []
        this.state.dropbox.files.forEach((file, i) =>{ 
            filesList.push(<li key = {i}>{file.name}</li>)
        })


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
                    <Button className='cardAttachment' className="attachmentFormSpace" bsStyle="primary" onClick={this.onClickAddAttachment} disabled={'undefined' === typeof this.state.file}>Add</Button>
                    {$imagePreview}
                </div>
                <div className = "dropboxDiv">
                    <div className="container main">

                        {(!Auth.isUserAuthenticatedWithDropbox()) ?
                        <div id={"pre-auth-section" + this.state.cardId}>
                            <p>This example takes the user through Dropbox's API OAuth flow using <code>Dropbox.getAuthenticationUrl()</code> method [<a href="http://dropbox.github.io/dropbox-sdk-js/Dropbox.html#getAuthenticationUrl">docs</a>] and then uses the generated access token to list the contents of their root directory.</p>
                            <a href="" id={"authlink" + this.state.cardId} className="button">Authenticate</a>
                            <p className="info">Once authenticated, it will use the access token to list the files in your root directory.</p>
                        </div>
                        :
                        <div id={"authed-section" + this.state.cardId}>
                            <p>You have successfully authenticated. Below are the contents of your root directory. They were fetched using the SDK and access token.</p>
                            <ul id={"files" + this.state.cardId}>
                                {filesList}
                            </ul>
                        </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
    
    // Render a list of items to #files
    renderItems = (items) => {
        this.setState({files: items})
        //items.filter(item => item.name.match(/\.(pdf)$/)).forEach((item) => this.printItem(item))
    }

    printItem = (item) => {
        this.state.dbx.filesDownload({path: item.path_display})
        .then(function (response) {
            var blob = response.fileBlob;
            var reader = new FileReader();
            reader.addEventListener("loadend", function() {
                console.log(reader.result); // will print out file content
            });
            reader.readAsText(blob);
        })
        .catch(function (error) {
            console.log(error)
        })
    }

    dropboxBegin = () => {
        if (!Auth.isUserAuthenticatedWithDropbox()) {
            // Set the login anchors href using dbx.getAuthenticationUrl()
            const dbx = new Dropbox({ clientId: "owvw24g2oefq2gs" })
            const authUrl = dbx.getAuthenticationUrl('http://localhost:3000/dropboxAuth', window.location.pathname + '|' + this.state.card.state.cardInfos._id)
            document.getElementById('authlink' + this.state.cardId).href = authUrl
        }
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
        const dateNow = Date.now()

        let formData = new FormData()
        formData.append("attachment", this.state.file)
        formData.append("postedBy", Auth.getUserID())
        formData.append("title", this.state.title.trim())
        formData.append("datePost", dateNow)

        axios.post(url.api + 'attachment/card/' + this.props.card.state.cardInfos._id, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }, url.config).then((response) => {
            const newAttachment = {
                _id: response.data._id,
                image: response.data.image,
                title: this.state.title.trim(),
                postedBy: Auth.getUserID(),
                datePost:dateNow
            }
            this.socket.emit('newAttachmentServer', newAttachment)
            this.addAttachment(newAttachment)
        }).catch((error) => {
            alert('An error occured when adding the attachment')
        })
    }

    addAttachment(attachment) {
        let newAttachments = this.state.card.state.attachments
        newAttachments.unshift(attachment)
        this.state.card.setState({attachments: newAttachments})
        this.state.popup.setState({attachments: newAttachments})
        this.setState({
            attachment: undefined,
            title: ""
        })
    }
}

export default Attachment
