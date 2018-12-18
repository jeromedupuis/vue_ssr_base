const axios = require('axios');

export function API(){
  axios.defaults.timeout = 5000;
  return axios;
}
