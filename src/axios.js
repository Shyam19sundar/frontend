import axios from 'axios'

const instance = axios.create({
    baseURL: "https://desolate-fortress-07828.herokuapp.com"
})
export default instance;