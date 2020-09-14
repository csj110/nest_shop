const getBenYuanFreight = price => {
  return price > 95 ? 0 : 8;
};

const map = {
  1: getBenYuanFreight,
};

export const getShopFreigt = (shopId, price) => {
  const getFeight = map[shopId];
  return getFeight(price);
};
