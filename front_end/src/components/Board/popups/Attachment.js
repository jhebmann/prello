import React from 'react'
import { Button, FormControl } from 'react-bootstrap'
import axios from 'axios'
import url from '../../../config'
import Auth from '../../Auth/Auth.js'
import DropboxChooser from 'react-dropbox-chooser'
import { Spin } from 'antd'
import handleServerResponse from '../../../response'
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
            dbx: this.props.dbx,
            isLoading: false
        }

        this.socket = this.props.io
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleNewFile = this.handleNewFile.bind(this)
        this.onClickAddAttachment = this.onClickAddAttachment.bind(this)
        this.dropboxBegin = this.dropboxBegin.bind(this)
        this.printItem = this.printItem.bind(this)
    }

    componentDidMount = () => {
        this.dropboxBegin()
    }

    componentWillReceiveProps(nextProps){
        this.setState({dbx: nextProps.dbx})
    }

    render(){
        let imagePreview = null
        if (this.state.imagePreviewUrl) {
            imagePreview = <img className="attachmentImgPreview" src={this.state.imagePreviewUrl} alt={this.state.title}/>
        } else  if (this.state.isLoading){
            imagePreview = <div className="spinn">
                                <Spin size='large' />
                            </div>
        } else {
            imagePreview = ""
        }

        return(
            <div className="AttachmentDiv">
                <hr className="skylightHr"/>
                <div className="attachmentForm">
                    <div className="filesSelect">
                        <label htmlFor={"fileSpace" + this.state.cardId} className="btn">Select Image from your computer</label>
                        <FormControl id={"fileSpace" + this.state.cardId} type="file" name="file" accept="image/*" placeholder="Attachment" onChange={this.handleNewFile} className="fileSpace attachmentFormSpace"/>
                        <div className="or">or</div>
                        <div className="attachmentFormSpace">
                            {(!Auth.isUserAuthenticatedWithDropbox()) ?
                            <div>
                                <div id={"pre-auth-section" + this.state.cardId}>
                                    <a href="" id={"authlink" + this.state.cardId} className="dropbox-button"><span className="dropin-btn-status"></span>Authenticate</a>
                                </div>
                            </div>
                            :
                            <div id={"authed-section" + this.state.cardId}>
                                <DropboxChooser
                                    appKey={'owvw24g2oefq2gs'}
                                    success={file => this.printItem(file)}
                                    multiselect={false}
                                    extensions={['.png', '.jpg', '.jpeg', '.gif']} >
                                    <a className="dropbox-button"><span className="dropin-btn-status"></span>Choose from Dropbox</a>
                                </DropboxChooser>
                            </div>
                            }
                        </div>
                    </div>
                    <Button className="attachmentFormSpace centered" bsStyle="primary" onClick={this.onClickAddAttachment} disabled={this.state.imagePreviewUrl.length === 0}>Add</Button>
                    {imagePreview}
                </div>
            </div>
        )
    }

    // Render a list of items to #files
    renderItems = (items) => {
        this.setState({files: items})
        //items.filter(item => item.name.match(/\.(pdf)$/)).forEach((item) => this.printItem(item))
    }

    printItem = (items) => {
        this.setState({
            file: null,
            title: "",
            imagePreviewUrl: "",
            isLoading: true
        })

        const item = items[0]
        this.state.dbx.sharingGetSharedLinkFile({url: item.link})
        .then((response) => {
            const blob = response.fileBlob
            const file = new File([blob], item.name)
            const reader = new FileReader()
            reader.onloadend = (upload) => {
                this.setState({
                    file: file,
                    title: item.name,
                    imagePreviewUrl: reader.result,
                    isLoading: false
                  })
            }
            reader.readAsDataURL(file)
        })
        .catch(function (error) {
            handleServerResponse(error, 'An error occured when adding the attachment')
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
        this.setState({
            [e.target.name]: e.target.value,
            title: "",
            imagePreviewUrl: "",
            isLoading: true
        })
    }

    handleNewFile = (e) => {
        this.setState({isLoading: true})

        const reader = new FileReader()
        const file = e.target.files[0]

        reader.onloadend = (upload) => {
          this.setState({
            file: file,
            title: file.name,
            imagePreviewUrl: reader.result
          })
        }

        reader.readAsDataURL(file)
    }

    onClickAddAttachment() {

        const dateNow = Date.now()

        let formData = new FormData()
        formData.append("attachment", this.state.file)
        formData.append("postedBy", Auth.getUserID())
        formData.append("title", this.state.title.trim())
        formData.append("datePost", dateNow)

        let headers = url.config
        headers["Content-Type"] = 'multipart/form-data'

        axios.post(url.api + 'attachment/card/' + this.props.card.state.cardInfos._id, formData, headers)
        .then((response) => {
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
            handleServerResponse(error, 'An error occured when adding the attachment')
        })
    }

    addAttachment(attachment) {
        let newAttachments = this.state.card.state.attachments
        newAttachments.unshift(attachment)
        this.state.card.setState({attachments: newAttachments})
        this.state.popup.setState({attachments: newAttachments})
        this.setState({
            attachment: undefined,
            title: "",
            file:null,
            imagePreviewUrl: '',
            isLoading: false
        })
        this.state.popup.handlePopupClose("attachment")
        document.getElementById("fileSpace" + this.state.cardId).value = ""
    }
}

export default Attachment
