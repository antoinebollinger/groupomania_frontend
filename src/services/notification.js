const axios = require('axios');

// Expected data : {"currentUserId": currentUserId, "postId": postId, "commentId": commentId}

function createNotification(data) {
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.VUE_APP_API}/api/notification`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.token}`
            }
        })
        .then(response => {
            resolve(response);
        })
        .catch(error => {
            reject(error);
        })
    })
}

function unactiveNotification(notificationId) {
    return new Promise((resolve, reject) => {
        axios.post(`${process.env.VUE_APP_API}/api/notification/${notificationId}/active`, { "currentUserId": localStorage.id }, {
            headers: {
                Authorization: `Bearer ${localStorage.token}`
            }
        })
        .then(response => {
            resolve(response);
        })
        .catch(error => {
            reject(error);
        })

    })
}

function activeNotification(notificationId) {
    return new Promise((resolve, reject) => {
        axios.delete(`${process.env.VUE_APP_API}/api/notification/${notificationId}/active`, {
            headers: {
                Authorization: `Bearer ${localStorage.token}`
            },
            data: {
                "currentUserId": localStorage.id
            }
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
        createNotification,
        unactiveNotification,
        activeNotification
    }
};