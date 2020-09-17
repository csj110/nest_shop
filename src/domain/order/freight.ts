const getBenYuanFreight = price => {
  return price > 95 ? 0 : 8;
};

const getSunFenFreight = price => {
  return price > 2000 ? 0 : 10;
};

const map = {
  1: getBenYuanFreight,
  2: getSunFenFreight,
};

export const getShopFreigt = (shopId, price) => {
  const getFeight = map[shopId];
  return getFeight(price);
};
