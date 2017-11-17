import React from 'react'

class UnAuthorized extends React.Component {
    render () {
        return (
            <div className="container">
                <h2>403 Forbidden : You don't have the rights to access this resource</h2>
            </div>
        )
    }
}
export default UnAuthorized