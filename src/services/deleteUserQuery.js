const axios = require('axios');

// Expected data: {"token": token, "id": id, "body": {"email": email, "password": password, "deleteDatas": true/false, "admin": true/false}}

function deleteUserQuery(data) {
    return new Promise((resolve, reject) => {
        axios.delete(process.env.VUE_APP_API+'/api/user/'+data.id, {
            headers: {
                Authorization: "Bearer "+data.token
            }, 
            data: data.body
        })
        .then(response => {
            resolve(response);
        })
        .catch(error => {
            reject(error);
        })
    })
}

export default {
    methods: {
        deleteUserQuery
    }
}