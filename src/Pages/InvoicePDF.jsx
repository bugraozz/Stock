import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// PDF için stil tanımları
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  section: {
    marginBottom: 15,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  customerInfo: {
    marginBottom: 20,
  },
  productHeader: {
    flexDirection: 'row',
    borderBottom: '1 solid black',
    paddingBottom: 5,
    marginBottom: 10,
  },
  productRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  productCell: {
    flex: 1,
  },
  total: {
    marginTop: 20,
    textAlign: 'right',
  },
  footer: {
    marginTop: 30,
    borderTop: '1 solid black',
    paddingTop: 10,
    textAlign: 'center',
  },
});

// InvoicePDF bileşeni
const InvoicePDF = ({ customer, products, totalPrice, id }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Fatura Başlığı */}
      <View style={styles.header}>
        <Text>Invoice #{id}</Text>
      </View>

      {/* Müşteri Bilgileri */}
      <View style={styles.section}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>Customer Information:</Text>
        <Text>Name: {customer.name}</Text>
        <Text>Address: {customer.address}</Text>
        <Text>Phone: {customer.phone}</Text>
        <Text>Email: {customer.email}</Text>
      </View>

      {/* Ürünler */}
      <View style={styles.section}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>Products:</Text>
        <View style={styles.productHeader}>
          <Text style={[styles.productCell, { fontWeight: 'bold' }]}>Product Name</Text>
          <Text style={[styles.productCell, { fontWeight: 'bold' }]}>Quantity</Text>
          <Text style={[styles.productCell, { fontWeight: 'bold' }]}>Price</Text>
        </View>
        {products && products.length > 0 ? (
          products.map((item, index) => (
            <View key={index} style={styles.productRow}>
              <Text style={styles.productCell}>{item.product.Product_Name || 'N/A'}</Text>
              <Text style={styles.productCell}>{item.quantity || 'N/A'}</Text>
              <Text style={styles.productCell}>{item.product.SellingPrice || 'N/A'}</Text>
            </View>
          ))
        ) : (
          <Text>No products available</Text>
        )}
      </View>

      {/* Toplam Fiyat */}
      <View style={styles.total}>
        <Text style={{ fontSize: 16 }}>Total Price: {totalPrice}₺</Text>
      </View>

      {/* Fatura Altbilgisi */}
      <View style={styles.footer}>
        <Text>Thank you for your business!</Text>
        <Text>{new Date().toLocaleDateString()}</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;




