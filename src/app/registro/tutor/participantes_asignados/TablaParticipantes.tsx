"use client";

import React from "react";

const datos = [
  { id: 1, nombre: "Juan Pérez", carrera: "Ingeniería de Sistemas", correo: "juan@example.com" },
  { id: 2, nombre: "María López", carrera: "Ingeniería Electrónica", correo: "maria@example.com" },
  { id: 3, nombre: "Carlos Sánchez", carrera: "Arquitectura", correo: "carlos@example.com" }
];

export default function TablaParticipantes() {
  return (
    
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" } as React.CSSProperties}>
      <thead>
        <tr>
          <th style={estiloEncabezado}>ID</th>
          <th style={estiloEncabezado}>Nombre</th>
          <th style={estiloEncabezado}>Carrera</th>
          <th style={estiloEncabezado}>Correo</th>
        </tr>
      </thead>
      <tbody>
        {datos.map((participante) => (
          <tr key={participante.id}>
            <td style={estiloCelda}>{participante.id}</td>
            <td style={estiloCelda}>{participante.nombre}</td>
            <td style={estiloCelda}>{participante.carrera}</td>
            <td style={estiloCelda}>{participante.correo}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const estiloEncabezado: React.CSSProperties = {
  backgroundColor: "#1abc9c",
  color: "#fff",
  padding: "10px",
  textAlign: "left",
};

const estiloCelda: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "8px",
  backgroundColor: "#34495e",
  color: "#ecf0f1",
};
