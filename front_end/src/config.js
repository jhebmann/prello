import Auth from './components/Auth/Auth.js';

const config = {
    socket:"http://localhost:8000/",
    api: "http://localhost:8000/api/",
    config: {headers: {"authorization": "Bearer: " + Auth.getToken()}},
    dropboxKey: "s2hl4kvxhl6hpwn"
}

export default config