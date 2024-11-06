// controllers/dataController.js
const path = require('path');
const xlsx = require('xlsx');

// Función para leer el archivo Excel
const readExcelFile = () => {
    const filePath = path.join(__dirname, '..', 'uploads', 'InventarioContenedor OPTAINER.xlsx'); // Cambia 'tu_archivo.xlsx' por el nombre de tu archivo
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Asumiendo que quieres la primera hoja
    const sheet = workbook.Sheets[sheetName];

    return xlsx.utils.sheet_to_json(sheet);
};

// Controlador para obtener los datos de los contenedores
const getContenedores = (req, res) => {
    try {
        const data = readExcelFile();
        const filteredData = data.map(row => ({
            contenedor: row['Contenedor'],
            ubicacion: row['Ubicación'],
            visado: row['Visado'],
        }));
        res.json(filteredData);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer el archivo' });
    }
};

module.exports = {
    getContenedores,
};
