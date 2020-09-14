const axios = require("axios");
const querystring = require("querystring");
const crypto = require("crypto");
const md5 = crypto.createHash("md5");
var FormData = require("formdata-node");
const http = axios.create({
  baseURL: "http://openapitestb.benlai.com",
  headers: {
    "Content-Type": "multipart/form-data",
    "Authorization":
			"Basic QjIyOTkzMzE5MjI1MTkzMzoyZDRkZTk0YTJiOTc0OWE1OTZlNDU5OWNjMmJlYWNhNw==",
			"X-Real-IP":"119.28.59.171"
  }
});

const data = new FormData();

data.set("grant_type", "client_credentials");
data.set("scope", "yghwechat");
console.log(data);
http
  .post("token", data)
  .then(res => {
    console.log(res);
  })
  .catch(err => console.log(err));
setTimeout(() => {
  console.log("object");
}, 1000 * 5);
