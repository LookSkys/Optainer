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

const writeExcelFile = (workbook, filePath) => {
    xlsx.writeFile(workbook, filePath);
};

const addContenedor = (req, res) => {
    console.log('Cuerpo de la solicitud:', req.body);
    const { contenedor, ubicacion} = req.body;
    console.log("Datos recibidos:", contenedor, ubicacion); 
    try {
        const filePath = path.join(__dirname, '..', 'uploads', 'InventarioContenedor OPTAINER.xlsx');
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Obtener los datos existentes y agregar el nuevo contenedor
        const data = xlsx.utils.sheet_to_json(sheet);
        data.push({ 'Contenedor': contenedor, 'Ubicación': ubicacion}); // Correcto

        // Volver a convertir el JSON a hoja de cálculo y escribir el archivo
        const newSheet = xlsx.utils.json_to_sheet(data);
        workbook.Sheets[sheetName] = newSheet;
        xlsx.writeFile(workbook, filePath);

        res.status(201).json({ message: 'Contenedor agregado' });
    } catch (error) {
        console.error(error); // Añadir para depuración
        res.status(500).json({ error: 'Error al agregar el contenedor' });
    }
};

const removeContenedor = (req, res) => {
    const { id } = req.params; // El ID debe coincidir con el ID del contenedor que quieres eliminar
    try {
        const filePath = path.join(__dirname, '..', 'uploads', 'InventarioContenedor OPTAINER.xlsx');
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Obtener los datos existentes y filtrar el contenedor que se quiere eliminar
        let data = xlsx.utils.sheet_to_json(sheet);
        data = data.filter(row => row['Contenedor'] !== id); // Correcto

        // Volver a convertir el JSON a hoja de cálculo y escribir el archivo
        const newSheet = xlsx.utils.json_to_sheet(data);
        workbook.Sheets[sheetName] = newSheet;
        xlsx.writeFile(workbook, filePath);

        res.json({ message: 'Contenedor eliminado' });
    } catch (error) {
        console.error(error); // Añadir para depuración
        res.status(500).json({ error: 'Error al eliminar el contenedor' });
    }
};

module.exports = {
    getContenedores,
    addContenedor,
    removeContenedor,
    writeExcelFile
};
