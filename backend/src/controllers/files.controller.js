const externalApiService = require("../services/externalApi.service");
const asyncHandler = require("../middlewares/asyncHandler");
const { HTTP_STATUS } = require("../constants");

const getFilesList = asyncHandler(async (req, res) => {
  const filesList = await externalApiService.getFilesList();
  res.status(HTTP_STATUS.OK).json({ files: filesList });
});

const getFilesData = asyncHandler(async (req, res) => {
  const { fileName } = req.query;
  const data = await externalApiService.processFiles(fileName);
  res.status(HTTP_STATUS.OK).json(data);
});

module.exports = {
  getFilesList,
  getFilesData,
};
