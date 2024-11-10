// import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// // PDF için stil tanımları
// const styles = StyleSheet.create({
//   page: {
//     padding: 30,
//     fontSize: 12,
//   },
//   section: {
//     marginBottom: 15,
//   },
//   header: {
//     fontSize: 20,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   customerInfo: {
//     marginBottom: 20,
//   },
//   productHeader: {
//     flexDirection: 'row',
//     borderBottom: '1 solid black',
//     paddingBottom: 5,
//     marginBottom: 10,
//   },
//   productRow: {
//     flexDirection: 'row',
//     marginBottom: 5,
//   },
//   productCell: {
//     flex: 1,
//   },
//   total: {
//     marginTop: 20,
//     textAlign: 'right',
//   },
//   footer: {
//     marginTop: 30,
//     borderTop: '1 solid black',
//     paddingTop: 10,
//     textAlign: 'center',
//   },
// });

// // InvoicePDF bileşeni
// const InvoicePDF = ({ customer, products, totalPrice, id }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
      
//       {/* Fatura Başlığı */}
//       <View style={styles.header}>
//         <Text>Invoice #{id}</Text>
//       </View>

//       {/* Müşteri Bilgileri */}
//       <View style={styles.section}>
//         <Text style={{ fontSize: 16, marginBottom: 10 }}>Customer Information:</Text>
//         <Text>Name: {customer.name}</Text>
//         <Text>Address: {customer.address}</Text>
//         <Text>Phone: {customer.phone}</Text>
//         <Text>Email: {customer.email}</Text>
//       </View>

//       {/* Ürünler */}
//       <View style={styles.section}>
//         <Text style={{ fontSize: 16, marginBottom: 10 }}>Products:</Text>
//         <View style={styles.productHeader}>
//           <Text style={[styles.productCell, { fontWeight: 'bold' }]}>Product Name</Text>
//           <Text style={[styles.productCell, { fontWeight: 'bold' }]}>Quantity</Text>
//           <Text style={[styles.productCell, { fontWeight: 'bold' }]}>Price</Text>
//         </View>
//         {products && products.length > 0 ? (
//           products.map((item, index) => (
//             <View key={index} style={styles.productRow}>
//               <Text style={styles.productCell}>{item.product.productName || 'N/A'}</Text>
//               <Text style={styles.productCell}>{item.quantity || 'N/A'}</Text>
//               <Text style={styles.productCell}>{item.product.price || 'N/A'}</Text>
//             </View>
//           ))
//         ) : (
//           <Text>No products available</Text>
//         )}
//       </View>

//       {/* Toplam Fiyat */}
//       <View style={styles.total}>
//         <Text style={{ fontSize: 16 }}>Total Price: {totalPrice}₺</Text>
//       </View>

//       {/* Fatura Altbilgisi */}
//       <View style={styles.footer}>
//         <Text>Thank you for your business!</Text>
//         <Text>{new Date().toLocaleDateString()}</Text>
//       </View>
//     </Page>
//   </Document>
// );

// export default InvoicePDF;



import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
});

const InvoicePDF = ({ customer, products, totalPrice, id }) => {
  // Kontrol ekle
  if (!customer || !products || !Array.isArray(products) || products.length === 0) {
    return <Text>Fatura verileri mevcut değil.</Text>;
  }

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Invoice #{id}</Text>
        <View style={styles.section}>
          <Text>Müşteri Bilgileri:</Text>
          <Text>Adı: {customer.name || 'Bilgi Yok'}</Text>
          <Text>Adres: {customer.address || 'Bilgi Yok'}</Text>
          <Text>Telefon: {customer.phone || 'Bilgi Yok'}</Text>
          <Text>Email: {customer.email || 'Bilgi Yok'}</Text>
        </View>

        <View style={styles.section}>
          <Text>Ürünler:</Text>
          {products.map((item, index) => {
            const price = parseFloat(item.price) || 0;
            const quantity = item.quantity || 0;
            const total = (price * quantity).toFixed(2);
            const currency = item.currency || '₺';

            return (
              <View key={index} style={styles.productRow}>
                <Text>{item.productName || 'Ürün adı mevcut değil'}</Text>
                <Text>{quantity}</Text>
                <Text>{item.price ? `${item.price} ${currency}` : 'Fiyat mevcut değil'}</Text>
                <Text>{item.price && quantity ? `${total} ${currency}` : 'Toplam mevcut değil'}</Text>
              </View>
            );
          })}
        </View>

        <Text style={{ textAlign: 'right', marginTop: 20 }}>
          Toplam Tutar: {totalPrice || '₺ 0.00'}
        </Text>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Teşekkür ederiz!</Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
