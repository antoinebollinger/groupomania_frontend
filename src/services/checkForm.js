function checkForm(inputs) {
    let result = true;
    let invalidElements = {};
    inputs.forEach(element => {
        let regExTest = "";
        let returnMsg = "";
        switch(element.getAttribute("data-type")) {
            case "text": 
            //Les textes doivent contenir des caractères alphanumériques, apostrophe et espace, et ne pas être vides
            regExTest = /^[/A-Za-z\u00C0-\u017F -,]+$/;
            returnMsg = "Ce champ ne peut pas être vide.";
            break;
            case "textEmpty": 
            //Variante pour les textes qui peuvent être vide
            regExTest = /^[/A-Za-z\u00C0-\u017F -,]*$/;
            returnMsg = "Ce champ ne doit contenir que des caractères alphanumériques.";
            break;
            case "email":
            //Les emails doivent avoir une structure d'email blabla@bla.bla
            regExTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            returnMsg = "Veuillez rentrer une adresse email valide.";
            break;
            case "password":
            //Les mots de passe doivent contenir au moins 1 minuscule, 1 majuscule, 1 chiffre, 1 caractère spécial
            regExTest = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            returnMsg = "Minimum 8 caractères et tous les caractères ci-dessous.";
            break;
            default: 
            regExTest = /^[a-zA-Z0-9]*$/;
            returnMsg = "";
            break;
        }
        if (!regExTest.test(element.value)) {
            invalidElements[element.id] = returnMsg;
            result = false;
        }
    });
    const resultat = {"valid": result, "elements": invalidElements};
    return resultat;
}

function checkPassword(password) {
    return {
        "minuscule": /[a-z]/.test(password),
        "majuscule": /[A-Z]/.test(password),
        "chiffre": /[0-9]/.test(password),
        "special": /[@$!%*?&]/.test(password)
    }
}

export default {
    methods: {
        checkForm,
        checkPassword
    }
};