const axios = require("axios");
const { parse } = require("csv-parse/sync");
const config = require("../config");
const { CSV_CONFIG, ERROR_MESSAGES } = require("../constants");

const baseUrl = config.externalApi.baseUrl;
const headers = {
  authorization: config.externalApi.apiKey,
};

const getFilesList = async () => {
  try {
    const response = await axios.get(`${baseUrl}/files`, { headers });
    return response.data.files || [];
  } catch (error) {
    console.error("Error fetching files list:", error.message);
    throw new Error(ERROR_MESSAGES.FETCH_FILES_LIST_FAILED);
  }
};

const getFileContent = async (fileName) => {
  try {
    const response = await axios.get(`${baseUrl}/file/${fileName}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    // No loguear errores 404, son esperados para archivos vacíos
    if (error.response?.status !== 404 && error.response?.status !== 500) {
      console.error(`Error fetching file ${fileName}:`, error.message);
    }
    return null;
  }
};

const parseCSV = (csvContent) => {
  try {
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      skip_records_with_error: true,
    });
    return records;
  } catch (error) {
    // Los errores de parsing son esperados, no los mostramos
    return [];
  }
};

const validateCSVLine = (line) => {
  // Verificar que todos los campos requeridos existan
  const hasAllFields = CSV_CONFIG.REQUIRED_FIELDS.every(
    (field) => field in line
  );
  if (!hasAllFields) {
    return false;
  }

  // Verificar que ningún campo esté vacío
  const hasEmptyFields = CSV_CONFIG.REQUIRED_FIELDS.some((field) => {
    const value = line[field];
    return value === undefined || value === null || value === "";
  });
  if (hasEmptyFields) {
    return false;
  }

  // Validar que number sea un número válido
  const number = line.number;
  if (isNaN(number) || number.toString().trim() === "") {
    return false;
  }

  // Validar que hex sea un hexadecimal de 32 dígitos
  if (!CSV_CONFIG.HEX_PATTERN.test(line.hex)) {
    return false;
  }

  return true;
};

const processFiles = async (fileNameFilter = null) => {
  try {
    const filesList = await getFilesList();

    // Filtrar por nombre si se proporciona
    const filesToProcess = fileNameFilter
      ? filesList.filter((file) => file === fileNameFilter)
      : filesList;

    const processedData = [];

    for (const fileName of filesToProcess) {
      try {
        const content = await getFileContent(fileName);

        // Si hay error al descargar, continuar con el siguiente
        if (!content) {
          continue;
        }

        const records = parseCSV(content);

        // Filtrar líneas válidas
        const validLines = records
          .filter((line) => validateCSVLine(line))
          .map((line) => ({
            text: line.text,
            number: parseInt(line.number, 10),
            hex: line.hex,
          }));

        // Solo agregar archivos con líneas válidas
        if (validLines.length > 0) {
          processedData.push({
            file: fileName,
            lines: validLines,
          });
        }
      } catch (fileError) {
        // Errores individuales de archivos no detienen el proceso
        continue;
      }
    }

    return processedData;
  } catch (error) {
    console.error("Error processing files:", error.message);
    throw error;
  }
};

module.exports = {
  getFilesList,
  getFileContent,
  parseCSV,
  validateCSVLine,
  processFiles,
};
