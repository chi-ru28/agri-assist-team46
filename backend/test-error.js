const axios = require('axios');
axios.post('http://localhost:5000/api/auth/register', {
    name: "ABC",
    phone: "farmer26@gmail.com",
    password: "password123",
    role: "farmer",
    landSize: 5
}).then(res => console.log(res.data)).catch(err => {
    console.error(err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
});
