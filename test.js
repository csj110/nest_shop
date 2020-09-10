const axios = require('axios');
const querystring = require('querystring');
const crypto = require('crypto');

const md5 = crypto.createHash('md5');

const http = axios.create({
	baseURL: 'http://sandbox.womaiapp.com/api/rest',
	headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

const appkey = '190361';
const appsecret = 'd40lplz85dywwmjxgrv9cnkhjb72fqt6';

const zlPost = async (method, param = '') => {
	param = JSON.stringify(param);
	const eSrc = method + appkey + appsecret + param;
	const sign = md5.copy().update(eSrc).digest('hex').toUpperCase();
	const data = querystring.stringify({ method, appkey, param: encodeURIComponent(param), sign });
	const res = await http.post('', data);
	return res.data;
};

const zlApi = {
	fetchPPool() {
		return zlPost('womai.itempagenum.get');
	},
	fetchPList(p) {
		return zlPost('womai.itemlist.get', p);
	},
	fetchPDetail(p) {
		return zlPost('womai.itemdetail.get', p);
	},
	fetchPState(p) {
		return zlPost('womai.itemstatus.get', p);
	},
	fetchPImages(p) {
		return zlPost('womai.itemimage.get', p);
	},
	fetchPInventory(p) {
		return zlPost('womai.inventory.get', p);
	},
	fetchPPrice(p) {
		return zlPost('womai.price.get', p);
	},
	fetchPCate(p) {
		return zlPost('womai.itemcategory.get', p);
	},
	postPOrder(p) {
		return zlPost('womai.trade.add', p);
	},
	postPOrderConfirm(p) {
		return zlPost('womai.trade.confirm', p);
	},
	postPOrderCancel(p) {
		return zlPost('womai.trade.cancel', p);
	},
	checkPDelivery(p) {
		return zlPost('womai.area.vaild.get', p);
	},
	fetchPLogistics(p) {
		return zlPost('womai.logistics.get', p);
	}
};

zlApi.fetchPList({ pagenum: '1' }).then((res) => {
	console.log(res);
});
