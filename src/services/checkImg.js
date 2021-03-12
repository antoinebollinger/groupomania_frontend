// Expected data {"img": file, "allowedTypes": Array, "allowedSize": integer}

function checkImg(data) {
    let valid = true;
    let message = '';
    let allowedTypesString = data.allowedTypes.join(', ');
    let allowedTypes = data.allowedTypes.map(i => 'image/' + i);
    if (!allowedTypes.includes(data.img.type)) {
        valid = false;
        message = "Formats autorisés : "+allowedTypesString;
    } 
    if (data.img.size > data.allowedSize) {
        valid = false;
        message = "Taille maximale : "+data.allowedSize/1000000+"Mo";
    }
    return {"valid": valid, "message": message}
}

export default {
    methods: {
        checkImg
    }
}