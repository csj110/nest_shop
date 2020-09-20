const axios = require("axios");
const querystring = require("querystring");

const http = axios.create({
  baseURL: "http://openapitestb.benlai.com",
  headers: { "Content-Type": "application/x-www-form-urlencoded" }
});

const clientId = "B229933192251933";
const clientSecret = "2d4de94a2b9749a596e4599cc2beaca7";

let token = {
  token: "",
  refreshToken: "",
  createTime: ""
};

const sfPost = async (url, data, config) => {
  const res = await http.post(url, querystring.stringify(data), config);
  return res.data;
};

const sfGet = async (url, data) => {
  const resp = await http.get(url, { data: querystring.stringify(data) });
  return resp.data.value;
};
const benlaiApi = {
  async fetchToken() {
    const token = Buffer.from(clientId + ":" + clientSecret).toString("base64");
    const res = await http.post(
      "token",
      { grant_type: "client_credentials", scope: "yghwechat" },
      {
        headers: { Authorization: "Basic " + token }
      }
    );
    return res.data.value;
  }
};

benlaiApi
  .fetchToken()
  .then(res => console.log(res))
  .catch(e => console.log(e));
