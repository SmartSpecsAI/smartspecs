import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#F5F5F5',
    padding: 24,
    fontSize: 12,
    lineHeight: 1.4,
    color: '#2C3E50',
    fontFamily: 'Helvetica',
  },
  // Encabezado con fondo
  headerContainer: {
    backgroundColor: '#2C3E50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  projectInfo: {
    marginBottom: 16,
  },
  infoText: {
    fontSize: 11,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2980B9',
    marginBottom: 8,
    borderBottom: '1px solid #BDC3C7',
    paddingBottom: 4,
  },
  text: {
    fontSize: 11,
    marginBottom: 6,
  },
  requirementBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
    border: '1px solid #ECF0F1',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  requirementTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  label: {
    fontSize: 8,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  high: {
    backgroundColor: '#E74C3C',
  },
  medium: {
    backgroundColor: '#E67E22',
  },
  low: {
    backgroundColor: '#27AE60',
  },
  actionItemsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 2,
  },
  actionItem: {
    fontSize: 9,
    marginLeft: 10,
    marginBottom: 2,
  },
  footer: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 24,
    color: '#7F8C8D',
    borderTop: '1px solid #BDC3C7',
    paddingTop: 8,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 9,
    bottom: 15,
    right: 24,
    color: '#7F8C8D',
  },
});

export const PrdDocument = ({ prd }: { prd: any }) => (
  <Document>
    <Page style={styles.page}>

      {/* Encabezado */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Product Requirements Document (PRD)</Text>
      </View>

      {/* Información del proyecto */}
      <View style={styles.projectInfo}>
        <Text style={styles.infoText}>Proyecto: {prd.project}</Text>
        <Text style={styles.infoText}>Cliente: {prd.clientRepresentative}</Text>
        <Text style={styles.infoText}>Estado: {prd.status}</Text>
        <Text style={styles.infoText}>Fecha: {new Date().toLocaleDateString()}</Text>
      </View>

      {/* Descripción */}
      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.text}>{prd.description}</Text>

      {/* Requerimientos */}
      <Text style={styles.sectionTitle}>Requirement Items</Text>
      {prd.requirements.map((item: any, index: any) => (
        <View key={index} style={styles.requirementBox}>
          <Text style={styles.requirementTitle}>{item.title}</Text>
          <Text style={styles.text}>{item.description}</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold' }}>Tipo:</Text> {item.type} |{' '}
            <Text style={{ fontWeight: 'bold' }}>Tiempo:</Text> {item.estimatedTime} días |{' '}
            <Text style={{ fontWeight: 'bold' }}>Prioridad:</Text>
            <Text
              style={[
                styles.label,
                item.priority === 'High'
                  ? styles.high
                  : item.priority === 'Medium'
                  ? styles.medium
                  : styles.low,
              ]}
            >
              {item.priority}
            </Text>
          </Text>
          <Text style={styles.actionItemsTitle}>✅ Action Items:</Text>
          {item.actionItems && item.actionItems.length > 0 ? (
            item.actionItems.map((action: any, i: any) => (
              <Text key={i} style={styles.actionItem}>
                - {action}
              </Text>
            ))
          ) : (
            <Text style={styles.actionItem}>No hay acciones disponibles.</Text>
          )}
        </View>
      ))}

      {/* Footer */}
      <Text style={styles.footer}>Generado por SmartSpecs</Text>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </Page>
  </Document>
);