import axios from "axios";


const bitsgapInstance = axios.create({
    baseURL: "https://api.bitsgap.crypttops.com/",
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
    }
  });

export default bitsgapInstance 