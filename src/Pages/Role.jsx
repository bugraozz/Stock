import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Role = () => {

        const [roles, setRoles] = useState([]);
        const [error, setError] = useState(null);
      
        const fetchRoles = async () => {
          try {
            const response = await axios.get('http://localhost:3001/users');
            const users = response.data;
      
            
            users.forEach(user => {
              if (user.role === 'admin') {
                
                console.log(`Admin Kullanıcı: ${user.name}`);
              } else if (user.role === 'user') {
                
                console.log(`Normal Kullanıcı: ${user.name}`);
              } else if (user.role === 'executive') {
                
                console.log(`Yönetici: ${user.name}`);
              }
            });
      
            setRoles(users);
      
          } catch (error) {
            setError('Kullanıcı verileri yüklenirken hata oluştu.');
            console.error(error);
          }
        };
      
        useEffect(() => {
          fetchRoles();
        }, []);

}
