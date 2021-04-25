import checkValueType from './checkValueType.js';
import getObjectFlat from './getObjectFlat.js';

const checkTypeValid = (type) => {
    if (type === undefined || type === null) {
        return true;
    }
    if (checkValueType(type, Function) && checkValueType(type.prototype, Object)) {
        return true;
    }
    return false;
};

export default (paramsCheckRules, func) => {
    if (checkValueType(func, Function) === false) {
        return () => { };
    }
    if (
        paramsCheckRules !== undefined &&
        checkValueType(paramsCheckRules, Object) === false
    ) {
        return () => { };
    }

    let isRulesValid = true;
    Object.entries(paramsCheckRules || {}).forEach(([ruleName, rule]) => {
        if (checkValueType(rule, Object) === false) {
            isRulesValid = false;
        }
    });
    // TODO недоделал проверку правил

    if (isRulesValid === false) {
        return () => { };
    }

    return (...args) => {
        const argsFlat = getObjectFlat(args);
        console.log(argsFlat);
    // TODO нет проверки входных параметров
    };
};
