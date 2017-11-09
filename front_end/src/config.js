import Auth from './components/Auth/Auth.js';

const config = {
    api: "http://localhost:8000/api/",
    config: {headers: {"authorization": "Bearer: " + Auth.getToken()}}
}

export default config