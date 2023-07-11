import axios from "axios";

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_STRAPIURL,
});



const updateHeaderInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use((config) => {
    //    const jwtToken = "Bearer Token from Localstorage";
    
    // *   config*.headers["Authorization"] = jwtToken;
    console.log('config url: ', config.url);
    return config;
  });
};



updateHeaderInterceptor(httpClient);

export default httpClient;
