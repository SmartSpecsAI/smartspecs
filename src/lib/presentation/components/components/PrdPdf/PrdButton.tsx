"use client";
import { Button } from 'antd';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PrdDocument } from './PrdDocument';
import { prdData } from './prdData';
const PrdButton = () => {

  return (
    <PDFDownloadLink
      document={<PrdDocument prd={prdData} />}
      fileName="SmartSpecs_PRD.pdf"
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => (
        <Button type="primary">{loading ? 'Generating PDF...' : 'Export PRD as PDF'}</Button>
      )}
    </PDFDownloadLink>
  );
};

export default PrdButton;