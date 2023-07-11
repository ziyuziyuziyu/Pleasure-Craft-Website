import axios from 'axios';


const endpoint = process.env.REACT_APP_STRAPIURL;
const auth = process.env.REACT_APP_STRAPIAUTH;
export const getProjects = () => {
    let url = `http://${endpoint}/api/projects?populate=*`
    return axios.get(url, {
        headers: {
            'Authorization': `${auth}`,
        }
    });
       
};

export const getMedia = () => {
    let url = `http://${endpoint}/api/upload/files`
    return axios.get(url, {
        headers: {
            'Authorization': `${auth}`,
        }
    })
};

export const getConfig = () => {
    let url = `http://${endpoint}/api/config`
    return axios.get(url, {
        headers: {
            'Authorization': `${auth}`,
        }
    })
};
