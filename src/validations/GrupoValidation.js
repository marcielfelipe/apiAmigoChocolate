const { body, validationResult } = require('express-validator')
const GrupoValidationRules = () => {
    return [
        //body('dataSorteio').isDate({format: 'DD-MM-YYYY'}),
        body('valorMinimo').isNumeric(),
        body('valorMaximo').isNumeric(),
    ]
} 

module.exports = {
    GrupoValidationRules,
}