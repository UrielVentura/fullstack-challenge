import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.apiBaseUrl,
});

export const filesApi = {
  getFilesList: async () => {
    const response = await api.get("/files/list");
    return response.data;
  },

  getFilesData: async (fileName = null) => {
    const params = fileName ? { fileName } : {};
    const response = await api.get("/files/data", { params });
    return response.data;
  },
};

export default api;
