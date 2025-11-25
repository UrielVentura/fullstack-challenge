// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
};

// Error Messages
const ERROR_MESSAGES = {
  FETCH_FILES_LIST_FAILED: "Failed to fetch files list from external API",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
};

// CSV Configuration
const CSV_CONFIG = {
  REQUIRED_FIELDS: ["file", "text", "number", "hex"],
  HEX_PATTERN: /^[0-9a-fA-F]{32}$/,
  HEX_LENGTH: 32,
};

module.exports = {
  HTTP_STATUS,
  ERROR_MESSAGES,
  CSV_CONFIG,
};
