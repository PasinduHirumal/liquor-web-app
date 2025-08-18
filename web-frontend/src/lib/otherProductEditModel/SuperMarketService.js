import { axiosInstance } from "../axios";

export const SuperMarketService = {
  async getAll() {
    const res = await axiosInstance.get("/superMarket/getAllList");
    return res.data?.data || [];
  },

  async search(query) {
    const res = await axiosInstance.get("/superMarket/search", {
      params: { q: query },
    });
    return res.data?.data || [];
  },
};
