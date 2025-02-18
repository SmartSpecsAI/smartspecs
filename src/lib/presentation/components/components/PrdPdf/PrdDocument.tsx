import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 9,
    lineHeight: 1.3,
    color: '#333',
  },
  header: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 3,
    color: '#004080',
  },
  text: {
    marginBottom: 2,
  },
  requirementBox: {
    border: '1px solid #E0E0E0',
    borderRadius: 5,
    padding: 3,
    marginBottom: 5,
    backgroundColor: '#F8F8F8',
  },
  label: {
    fontSize: 7,
    paddingVertical: 1,
    paddingHorizontal: 3,
    borderRadius: 3,
    color: 'white',
  },
  high: { backgroundColor: '#E57373' },
  medium: { backgroundColor: '#FFB74D' },
  low: { backgroundColor: '#81C784' },
  footer: {
    fontSize: 7,
    textAlign: 'center',
    marginTop: 15,
    color: '#888',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 7,
    bottom: 15,
    right: 20,
    color: '#888',
  },
});

export const PrdDocument = ({ prd }: { prd: any }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Product Requirements Document (PRD)</Text>
      <Text style={{ fontSize: 9, marginBottom: 10 }}>Proyecto: {prd.project}</Text>
      <Text>Cliente: {prd.clientRepresentative}</Text>
      <Text>Estado: {prd.status}</Text>
      <Text>Fecha: {new Date().toLocaleDateString()}</Text>
      <Text style={styles.footer}>Generado por SmartSpecs</Text>

      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.text}>{prd.description}</Text>

      <Text style={styles.sectionTitle}>Transcripción</Text>
      <Text style={styles.text}>{prd.transcription}</Text>


      <Text style={styles.sectionTitle}>Requirement Items</Text>
      {prd.requirements.map((item: any, index: number) => (
        <View key={index} style={styles.requirementBox}>
          <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
          <Text style={styles.text}>{item.description}</Text>
          <Text style={styles.text}>
            <Text style={{ fontWeight: 'bold' }}>Tipo:</Text> {item.type}{' '}
            | <Text style={{ fontWeight: 'bold' }}>Tiempo:</Text> {item.estimatedTime} días{' '}
            | <Text style={{ fontWeight: 'bold' }}>Prioridad:</Text>{' '}
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
          <Text style={{ fontSize: 8, fontWeight: 'bold', marginTop: 3 }}>✅ Action Items:</Text>
          {item.actionItems && item.actionItems.length > 0 ? (
            item.actionItems.map((action: string, i: number) => (
              <Text key={i} style={{ fontSize: 8 }}>- {action}</Text>
            ))
          ) : (
            <Text style={{ fontSize: 8 }}>No hay acciones disponibles.</Text>
          )}
        </View>
      ))}
    </Page>
  </Document>
);