import React from 'react'

class UnAuthorized extends React.Component {
    render () {
        return (
            <div className="container">
                <p>401</p>
                <p>Unauthorized.</p>
            </div>
        )
    }
}
export default UnAuthorized