const axios = require('axios');

axios.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    }
);

module.exports = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete
};
