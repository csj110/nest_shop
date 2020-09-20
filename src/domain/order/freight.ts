import { InternalServerErrorException } from "@nestjs/common";

const getBenYuanFreight = price => {
  return price > 95 ? 0 : 8;
};

const getSunFenFreight = price => {
  return price > 2000 ? 0 : 10;
};
const getZhongliangFreight = price => {
  return price > 2000 ? 0 : 0;
};

const map = {
  1: getBenYuanFreight,
  2: getSunFenFreight,
  3: getZhongliangFreight,
};

export const getShopFreigt = (shopId, price) => {
  const getFreight = map[shopId];
  if (getFreight) {
    return getFreight(price)
  }
  throw new InternalServerErrorException("服务器出错,运费获取异常")
};
