


import React, { useEffect, useRef } from 'react';
import Quagga from 'quagga';
import '../Styles/StockPage.css';

const BarcodeScanner = ({ onScan, onClose }) => { 
    const videoContainerRef = useRef(null);

    useEffect(() => {
        if (videoContainerRef.current) {
            Quagga.init({
                inputStream: {
                    name: 'Live',
                    type: 'LiveStream',
                    target: videoContainerRef.current,
                    constraints: {
                        facingMode: 'environment',
                        width: { min: 1280 },
                        height: { min: 720 },
                    },
                    area: {
                        top: "30%",
                        right: "0%",
                        left: "0%",
                        bottom: "30%"
                    },
                },
                decoder: {
                    readers: [
                        'code_128_reader',
                        'ean_reader',
                        'ean_8_reader',
                        'code_39_reader',
                        'upc_reader',
                        'code_39_vin_reader'
                    ],
                },
                locate: true,
            }, (err) => {
                if (err) {
                    console.error('Quagga init error:', err);
                    return;
                }
                console.log('QuaggaJS started');
                Quagga.start();
            });

            
            Quagga.onDetected(handleDetected);
        }

        return () => {
            Quagga.offDetected(handleDetected);
            Quagga.stop(); // Bileşen kapatıldığında kamerayı durdur
            console.log('QuaggaJS stopped');
        };
    }, [onScan]);

    const handleDetected = (result) => {
        if (result && result.codeResult && result.codeResult.code) {
            const code = result.codeResult.code;
            console.log('Barkod Okundu:', code);
            onScan(code);
            Quagga.stop(); 
        }
    };

    const handleClose = () => {
        Quagga.stop(); 
        onClose(); // Modalı kapat
    };

    return (
        <div className="camera-container">
            <div id="video-container" ref={videoContainerRef}>
                <div className="barcode-line"></div>
            </div>
          
        </div>
    );
};

export default BarcodeScanner;




