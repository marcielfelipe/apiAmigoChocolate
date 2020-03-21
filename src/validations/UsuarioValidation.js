const { body, validationResult } = require('express-validator')
const UsuarioValidationRules = () => {
    return [
        body('email').isEmail(),
        body('dataNascimento').toDate(),
    ]
} 

module.exports = {
    UsuarioValidationRules,
}