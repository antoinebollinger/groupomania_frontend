const axios = require('axios');

// Expected data : {"email": email, "password": password}

function afterLogin(data) {
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.VUE_APP_API}/api/auth/login`, data)
        .then(response => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('id', response.data.currentUserId);
            localStorage.setItem('email', data.email);
            localStorage.setItem('firstName', response.data.firstName);
            localStorage.setItem('lastName', response.data.lastName);
            localStorage.setItem('fonction', response.data.fonction);
            localStorage.setItem('imageUrl', response.data.imageUrl);
            localStorage.setItem('admin', response.data.admin);
            localStorage.setItem('notification', response.data.notification);
            resolve(response);
        })
        .catch(error => {
            reject(error);
        })
    })
}

export default {
    methods: {
        afterLogin
    }
};