

import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

// Karakterleri uygun formata dönüştür
const encodeValue = (value) => {
    return value
        .replace(/ç/g, 'c')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ö/g, 'o')
        .replace(/Ç/g, 'C')
        .replace(/Ş/g, 'S')
        .replace(/İ/g, 'I')
        .replace(/Ğ/g, 'G')
        .replace(/Ü/g, 'U')
        .replace(/Ö/g, 'O');
};

const Barcode = ({ value }) => {
    const barcodeRef = useRef(null);

    useEffect(() => {
        if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, encodeValue(value), {
                format: 'CODE128',
                displayValue: false, // Alt yazıyı gizle
            });
        }
    }, [value]);

    return <svg ref={barcodeRef}></svg>;
};

export default Barcode;



