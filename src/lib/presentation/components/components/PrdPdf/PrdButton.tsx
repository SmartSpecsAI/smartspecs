// components/ExportPrdButton.tsx
"use client";
import { Button } from 'antd';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PrdDocument } from './PrdDocument';

const PrdButton = () => {
  const prdData = {
    title: "Requisitos del Proyecto X",
    project: "SmartSpecs",
    version: "1.0.0",
    description: "Este documento detalla los requisitos del proyecto.",
    requirements: [
      { 
        title: "Implementar transcripción de audio",
        description: "Implementar transcripción de audio", 
        type: "Funcional",
        estimatedTime: 5,
        priority: "High",
        actionItems: ["Definir requisitos técnicos", "Seleccionar tecnología"],
      },
      { 
        title: "Generar documentos PRD automáticamente", 
        description: "Generar documentos PRD automáticamente", 
        type: "Funcional", 
        estimatedTime: 3, 
        priority: "High", 
        actionItems: ["Investigar herramientas de automatización"], 
      },
      { 
        title: "Permitir validación de requisitos", 
        description: "Permitir validación de requisitos", 
        type: "Funcional", 
        estimatedTime: 2, 
        priority: "Medium", 
        actionItems: ["Definir criterios de validación"], 
      },
    ],
    notes: ["Las estimaciones son aproximadas.", "Se recomienda revisar el backlog semanalmente."],
  };

  return (
    <PDFDownloadLink
      document={<PrdDocument prd={prdData} />}
      fileName="SmartSpecs_PRD.pdf"
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => (
        <Button type="primary">{loading ? 'Generando PDF...' : 'Exportar PRD como PDF'}</Button>
      )}
    </PDFDownloadLink>
  );
};

export default PrdButton;