const axios = require('axios');

function logoutQuery() {
    const tokenTmp = localStorage.token;
    localStorage.clear()
    axios.get(process.env.VUE_APP_API+'/api/auth/logout', {
        headers: {'Authorization': 'Bearer '+tokenTmp}
    })
    .then(response => {
        setTimeout( () => window.location.reload(), 1500);
        this.$dialog({
            title: 'Déconnexion',
            content: response.data.message
        })
    })
    .catch(error => {
        console.log(error.response.data.message)
    });
}

export default {
    methods: {
        logoutQuery
    }
}