const { body, validationResult } = require('express-validator')
const UsuarioValidationRules = () => {
    return [
        body('email').isEmail(),
        //body('dataNascimento').isDate({format: 'YYY-MM-dd'}),
    ]
} 

module.exports = {
    UsuarioValidationRules,
}