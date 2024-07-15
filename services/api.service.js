import axios from "axios";

const baseAPI = "http://127.0.0.1:4000/";

export function getfull(url, params = null) {
  let setting = { method: "GET", url: url, params };

  return new Promise((resolve, reject) => {
    axios(setting)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error.toJSON());
      });
  });
}

export function get(url, params = null, token = false) {
  let setting = { method: "GET", url: baseAPI + url, params };
  if (token) setting.headers = { Authorization: "Bearer " + token };

  return new Promise((resolve, reject) => {
    axios(setting)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error.toJSON());
      });
  });
}

export function post(url, data = null, token = false) {
  let setting = { method: "POST", url: baseAPI + url, data };
  if (token) setting.headers = { Authorization: "Bearer " + token };

  return new Promise((resolve, reject) => {
    axios(setting)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error.toJSON());
      });
  });
}

export function path(url, data = null, token = false) {
  let setting = { method: "PATCH", url: baseAPI + url, data };
  if (token) setting.headers = { Authorization: "Bearer " + token };

  return new Promise((resolve, reject) => {
    axios(setting)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error.toJSON());
      });
  });
}

export function exclude(url, token = false) {
  let setting = { method: "DELETE", url: baseAPI + url };
  if (token) setting.headers = { Authorization: "Bearer " + token };

  return new Promise((resolve, reject) => {
    axios(setting)
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error.toJSON());
      });
  });
}

export function getLocale() {
  return axios({ method: "GET", url: "https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=pt" })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      return error.toJSON();
    });
}
