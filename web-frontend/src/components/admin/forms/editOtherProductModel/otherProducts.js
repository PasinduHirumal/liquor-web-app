import { axiosInstance } from "../../../../lib/axios";

export const OtherProductService = {
  async getCategories() {
    const res = await axiosInstance.get("/categories/getAll");
    return res.data?.data?.filter((c) => c.is_active && !c.is_liquor) || [];
  },

  async getById(id) {
    const res = await axiosInstance.get(`/other-products/getOtherProductById/${id}`);
    return res.data?.data;
  },

  async updateGeneral(id, payload) {
    return axiosInstance.patch(`/other-products/update/${id}`, payload);
  },

  async updatePrice(id, payload) {
    return axiosInstance.patch(`/other-products/update-price/${id}`, payload);
  },

  async updateQuantity(id, payload) {
    return axiosInstance.patch(`/other-products/update-quantity/${id}`, payload);
  },
};
