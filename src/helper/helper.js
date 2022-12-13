const helper = {};

/**
 * @description this function check requirement parameter
 * @param       parameter
 * @param       sourceParameter
 * @returns     validationMessage
 * @author     Semih Yıldız
 */
helper.checkParameter = function (parameter, sourceParameter) {
    let validationMessage = []
    sourceParameter.forEach(param => {
        if (!parameter.hasOwnProperty(param)) {
            validationMessage.push(`${param.toUpperCase()}-IS-NOT-PROVIDED`)
        }
    });
    return validationMessage;
}

module.exports = helper;
