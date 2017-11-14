import React from 'react'
import { Button, FormControl } from 'react-bootstrap'
import axios from 'axios'
import url from '../../../config'
import Auth from '../../Auth/Auth.js'
const Dropbox = require('dropbox');

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

    componentDidMount = () => {
        this.dropboxBegin()
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
                <div className = "dropboxDiv">
                    <div class="container main">
                        <div id="pre-auth-section" style={{display: "none"}}>
                            <p>This example takes the user through Dropbox's API OAuth flow using <code>Dropbox.getAuthenticationUrl()</code> method [<a href="http://dropbox.github.io/dropbox-sdk-js/Dropbox.html#getAuthenticationUrl">docs</a>] and then uses the generated access token to list the contents of their root directory.</p>
                            <a href="" id="authlink" class="button">Authenticate</a>
                            <p class="info">Once authenticated, it will use the access token to list the files in your root directory.</p>
                        </div>

                        <div id="authed-section" style={{display: "none"}}>
                            <p>You have successfully authenticated. Below are the contents of your root directory. They were fetched using the SDK and access token.</p>
                            <ul id="files"></ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }



    // Parses the url and gets the access token if it is in the urls hash
    getAccessTokenFromUrl = () => {
        console.log(window.location)
        console.log('ghjurihbjie')
        return //utils.parseQueryString(window.location.hash).access_token;
    }
    // If the user was just redirected from authenticating, the urls hash will
    // contain the access token.
    isAuthenticated = () => {
      return !!this.getAccessTokenFromUrl();
    }
    // Render a list of items to #files
    renderItems = (items) => {
      var filesContainer = document.getElementById('files');
      items.forEach(function(item) {
        var li = document.createElement('li');
        li.innerHTML = item.name;
        filesContainer.appendChild(li);
      });
    }
    // This example keeps both the authenticate and non-authenticated setions
    // in the DOM and uses this function to show/hide the correct section.
    showPageSection = (elementId) => {
      document.getElementById(elementId).style.display = 'block';
      //document.getElementById(elementId).style={display: 'block'}
    }

    dropboxBegin = () => {
//        if (this.isAuthenticated()) {
//            this.showPageSection('authed-section');
        // Create an instance of Dropbox with the access token and use it to
        // fetch and render the files in the users root directory.
/*        var dbx = new Dropbox({ accessToken: this.getAccessTokenFromUrl() });
        dbx.filesListFolder({path: ''})
            .then(function(response) {
            this.renderItems(response.entries);
            })
            .catch(function(error) {
            console.error(error);
            });*/
//        } else {
            this.showPageSection('pre-auth-section');
            // Set the login anchors href using dbx.getAuthenticationUrl()
            var dbx = new Dropbox({ clientId: "owvw24g2oefq2gs" });
            var authUrl = dbx.getAuthenticationUrl('http://localhost:3000/dropboxAuth', window.location.pathname + '|' + this.state.card.state.cardInfos._id);
            document.getElementById('authlink').href = authUrl;
//        }
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
