const handleServerResponse = (error, message) => {
    if ('undefined' !== typeof error.response){
        switch (error.response.status){
            case 401:
                window.location = "/login"
                break
            case 403:
                window.location = "/unauthorized"
                break
            case 404:
                window.location = "/404"
                break
            default:
                alert(message)
        }
    } else {
        alert(error)
    }
}

export default handleServerResponse