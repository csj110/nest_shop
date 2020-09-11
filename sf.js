const axios = require('axios');
const querystring = require('querystring');
const crypto = require('crypto');
const md5 = crypto.createHash('md5');
var FormData = require('formdata-node');
const http = axios.create({
	baseURL: 'http://openapi3testb.sfbest.com',
	headers: {
		'Content-Type': 'multipart/form-data',
		Authorization: 'Basic MjAxODEyMTgxNjQxNTc4Mzo5MDU2M2NiYzI0OTg0N2ZjYWI3OGE1YWQ1MzZkZTg1Ng=='
	}
});

const data = new FormData();

data.set('grant_type', 'client_credentials');
data.set('scope', 'all');
console.log(data);
http.post('token', data).then((res) => {
	console.log(res);
});
http.get('https://www.npmjs.com/package/formdata-node').then((res) => {
	console.log('res');
});
setTimeout(() => {
	console.log('object');
}, 1000 * 5);
