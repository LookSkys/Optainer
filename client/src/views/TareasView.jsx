import React, { useState } from "react";
import "./TareasView.css";

const TareasView = () => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [extractionList, setExtractionList] = useState([]);
    const [showExtractButton, setShowExtractButton] = useState(false);
    const [showUpdateButton, setShowUpdateButton] = useState(false);
    const [data, setData] = useState([
        { id: 1, movimiento: "CAIU-42325", estado: "Completado", prioridad: "Alta", fecha: "31/03/2024", costo: "$680", torre: "A", posicion: "1-1-1" },
        { id: 2, movimiento: "CAIU-5325", estado: "En progreso", prioridad: "Media", fecha: "30/03/2024", costo: "$3200", torre: "B", posicion: "2-1-1" },
        { id: 3, movimiento: "CAIU-12125", estado: "Atascado", prioridad: "Alta", fecha: "05/04/2024", costo: "$2200", torre: "C", posicion: "1-2-1" },
    ]);
    const [history, setHistory] = useState({
        "CAIU-42325": ["A-1-2", "A-1-3", "A-1-4"], // Historial de movimientos completados para el contenedor "CAIU-42325"
    });

    const handleRowClick = (row) => {
        setSelectedRow(row);
        const completedMoves = history[row.movimiento] || [];
    
        if (row.estado === "Completado") {
            // Mostrar todos los movimientos realizados con checkboxes bloqueados
            const moves = completedMoves.map(pos => ({
                posicion: pos,
                completed: true,
                locked: true,
            }));
            setExtractionList(moves);
            setShowUpdateButton(false);
            setShowExtractButton(false);
        } else if (row.estado === "En progreso") {
            const moves = [
                { posicion: `${row.torre}-1-2`, completed: true, locked: true },
                { posicion: `${row.torre}-1-3`, completed: completedMoves.includes(`${row.torre}-1-3`), locked: completedMoves.includes(`${row.torre}-1-3`) },
                { posicion: `${row.torre}-1-4`, completed: completedMoves.includes(`${row.torre}-1-4`), locked: completedMoves.includes(`${row.torre}-1-4`) },
            ];
            setExtractionList(moves);
            setShowUpdateButton(true);
            setShowExtractButton(false);
        } else {
            const moves = [
                { posicion: `${row.torre}-1-2`, completed: false, locked: false },
                { posicion: `${row.torre}-1-3`, completed: false, locked: false },
                { posicion: `${row.torre}-1-4`, completed: false, locked: false },
            ];
            setExtractionList(moves);
            setShowUpdateButton(true);
            setShowExtractButton(false);
        }
    };    

    const handleCheckboxChange = (index) => {
        const updatedList = [...extractionList];
        if (!updatedList[index].locked) {
            updatedList[index].completed = !updatedList[index].completed;
        }
        setExtractionList(updatedList);

        const allCompleted = updatedList.every(item => item.completed);
        const atLeastOneCompleted = updatedList.some(item => item.completed);

        setShowUpdateButton(atLeastOneCompleted && !allCompleted);
        setShowExtractButton(allCompleted);
    };

    const handleUpdate = () => {
        const completedMoves = extractionList.filter(item => item.completed).map(item => item.posicion);

        setHistory((prevHistory) => ({
            ...prevHistory,
            [selectedRow.movimiento]: completedMoves,
        }));

        const updatedData = data.map((row) =>
            row.movimiento === selectedRow.movimiento
                ? { ...row, estado: completedMoves.length === extractionList.length ? "Completado" : "En progreso" }
                : row
        );
        setData(updatedData);

        alert("Estado actualizado correctamente.");
        setSelectedRow(null);
        setExtractionList([]);
        setShowUpdateButton(false);
        setShowExtractButton(false);
    };

    const handleExtract = () => {
        // Registrar todos los movimientos realizados
        const completedMoves = extractionList.map((item) => item.posicion);
    
        // Actualizar el historial con todos los movimientos
        setHistory((prevHistory) => ({
            ...prevHistory,
            [selectedRow.movimiento]: completedMoves,
        }));
    
        // Cambiar el estado del contenedor a "Completado"
        const updatedData = data.map((row) =>
            row.movimiento === selectedRow.movimiento ? { ...row, estado: "Completado" } : row
        );
        setData(updatedData);
    
        alert("Extracción completada exitosamente.");
    
        // Limpiar la selección y restablecer los estados
        setSelectedRow(null);
        setExtractionList([]);
        setShowUpdateButton(false);
        setShowExtractButton(false);
    };
    

    const closeTable = () => {
        setSelectedRow(null);
        setExtractionList([]);
        setShowUpdateButton(false);
        setShowExtractButton(false);
    };

    return (
        <>
        <h2 style={{marginLeft: '95px'}}>TAREAS</h2>
        <div className="metricas-container">
            <table className="metricas-table">
                <thead>
                    <tr>
                        <th colSpan="7" className="table-title">Tareas de Extracción de Contenedores</th>
                    </tr>
                    <tr>
                        <th>MOVIMIENTO CONTENEDOR</th>
                        <th>ESTADO</th>
                        <th>PRIORIDAD</th>
                        <th>FECHA</th>
                        <th>COSTO</th>
                        <th>TORRE</th>
                        <th>POSICIÓN</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr
                            key={row.id}
                            onClick={() => handleRowClick(row)}
                            className={`metricas-row ${selectedRow?.id === row.id ? "selected-row" : ""}`}
                        >
                            <td>{row.movimiento}</td>
                            <td>{row.estado}</td>
                            <td>{row.prioridad}</td>
                            <td>{row.fecha}</td>
                            <td>{row.costo}</td>
                            <td>{row.torre}</td>
                            <td>{row.posicion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedRow && (
                <div className="extraction-table-container">
                    <table className="extraction-table">
                        <thead>
                            <tr>
                                <th colSpan="2" className="table-title">
                                    Movimientos necesarios para el contenedor {selectedRow.movimiento}
                                </th>
                            </tr>
                            <tr>
                                <th>POSICIÓN ACTUAL</th>
                                <th>CHECKLIST</th>
                            </tr>
                        </thead>
                        <tbody>
                            {extractionList.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.posicion}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={item.completed}
                                            disabled={item.locked}
                                            onChange={() => !item.locked && handleCheckboxChange(index)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {showUpdateButton && (
                        <button onClick={handleUpdate}>Actualizar</button>
                    )}
                    {showExtractButton && (
                        <button onClick={handleExtract}>Extraer</button>
                    )}
                    <button onClick={closeTable}>Cerrar</button>
                </div>
            )}
        </div>        
        </>
    );
};

export default TareasView;