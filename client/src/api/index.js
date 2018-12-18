import storage from '@/libs/storage';

const { API } = require('axios-client');

const axios = API();

var client = axios.create({
  baseURL: `http://${process.env.API_URL}`,
  headers: {
    'x-access-token': storage.session.get('jwt', '')
  }
});

if (client.server){
  cacheSources();
}

function cacheSources(){
  setTimeout(cacheSources, 1000 * 60 * 10);
}

export function get(url, params = null) {
  const cache = client.cachedItems;

  let key;

  if (params) {
    key = url + '_' + params.source;
  } else {
    key = url;
  }

  if (cache && cache.has(key)){
    return Promise.resolve(cache.get(key));
  } else {
    return new Promise((resolve, reject) => {
      client.get(url, {
        params: params
      })
        .then((res) => {
          cache && cache.set(key, res.data);
          resolve(res.data);
        })
        .catch((err) => {
          reject("Axios issue: " + err);
        });
    });
  }
}

export function post(url, params = null) {
  return new Promise((resolve, reject) => {
    client.post(url, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject("Axios issue: " + err);
      });
  });
}
export function put(url, params = null) {
  return new Promise((resolve, reject) => {
    client.put(url, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject("Axios issue: " + err);
      });
  });
}
export function del(url, params = null) {
  return new Promise((resolve, reject) => {
    client.delete(url, params)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject("Axios issue: " + err);
      });
  });
}

export function errorHandler(err) {
  console.warn(err);
  return null;
}
