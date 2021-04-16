import deepFreeze from './deepFreeze.js';

const getIsString = (value) => typeof value === 'string' || value instanceof String;
const getIsNumber = (value) => typeof value === 'number' || value instanceof Number;
const getIsBoolean = (value) => typeof value === 'boolean' || value instanceof Boolean;
const getIsSymbol = (value) => typeof value === 'symbol' || value instanceof Symbol;
const getIsObject = (value) => (typeof value === 'object' && value !== null) || value instanceof Object;

const getIsValidForInstanceOf = (type) => (type instanceof Function && getIsObject(type.prototype));

const getIsTypeValid = (type) => type === undefined || type === null || getIsValidForInstanceOf(type);

const getIsValidatorValid = (validator) => validator === undefined || validator instanceof Function;

const getIsValueCurrentType = (value, type) => {
    if (type === undefined) {
        return value === undefined;
    }
    if (type === null) {
        return value === null;
    }

    const typeName = type && type.name;
    const specialTypes = {
        String: getIsString,
        Number: getIsNumber,
        Boolean: getIsBoolean,
        Symbol: getIsSymbol,
        Object: getIsObject,
    };
    if (specialTypes[typeName]) {
        return specialTypes[typeName](value);
    }

    try {
        return value instanceof type;
    } catch (error) {
        console.log('instanceof error', error);
        return false;
    }
};

const getIsValuePassedValidator = (value, validator) => {
    if (validator === undefined) {
        return true;
    }
    if (validator instanceof Function) {
        return validator(value);
    }
    return false;
};

const getObjectFlatKeys = (incomeObject) => {
    const outObject = {};
    const iter = (iterObject, prefixKey) => {
        Object.entries(iterObject).forEach(([iterKey, iterValue]) => {
            const currentPrefix = prefixKey === '' ? '' : `${prefixKey}.`;
            const iterPrefixKey = `${currentPrefix}${iterKey}`;
            outObject[iterPrefixKey] = iterValue;

            const iterValuePrototype = (iterValue === null || iterValue === undefined)
                ? undefined
                : Object.getPrototypeOf(iterValue);
            const iterValueConstructor = iterValuePrototype && iterValuePrototype.constructor;
            if (
                iterValuePrototype === null ||
                iterValueConstructor === Object ||
                iterValueConstructor === Function
            ) {
                iter(iterValue, iterPrefixKey);
            }
        });
    };
    iter(incomeObject || {}, '');
    return outObject;
};

const getInfoParams = (params, rules) => {
    const paramsFlat = getObjectFlatKeys(params || {});
    const paramsFlatKeys = Object.keys(paramsFlat || {});
    const rulesKeys = Object.keys(rules || {});

    const isParamsObject = getIsObject(params);
    const isRulesObject = getIsObject(rules);
    const rulesMissing = paramsFlatKeys.filter((el) => !rulesKeys.includes(el));
    const rulesExtra = rulesKeys.filter((el) => !paramsFlatKeys.includes(el));


    const rulesNotObject = [];
    const rulesTypeNotValid = [];
    const rulesValidatorNotValid = [];
    const rulesNotPassed = [];

    Object.entries(rules || {}).forEach(([fieldName, rule]) => {
        if (rulesExtra.includes(fieldName)) {
            return;
        }

        const isRuleObject = getIsObject(rule, Object);
        if (isRuleObject === false) {
            rulesNotObject.push(fieldName);
            return;
        }

        const value = paramsFlat[fieldName];

        const isTypeValid = getIsTypeValid(rule.type);
        if (isTypeValid === false) {
            rulesTypeNotValid.push(fieldName);
        }

        const isValidatorValid = getIsValidatorValid(rule.validator);
        if (isValidatorValid === false) {
            rulesValidatorNotValid.push(fieldName);
        }

        if (isTypeValid === false || isValidatorValid === false) {
            return;
        }

        const isValueCurrentType = getIsValueCurrentType(value, rule.type);
        const isValuePassedValidator = getIsValuePassedValidator(value, rule.validator);
        const isValuePassedRule = isValueCurrentType && isValuePassedValidator;
        if (isValuePassedRule === false) {
            rulesNotPassed.push(fieldName);
        }
    });

    const info = {
        isParamsObject,
        isRulesObject,
        rulesMissing,
        rulesExtra,
        rulesNotObject,
        rulesTypeNotValid,
        rulesValidatorNotValid,
        rulesNotPassed,
    };
    deepFreeze(info);
    return info;
};

const checkParams = (params, rules) => {
    const infoParams = getInfoParams(params, rules);
    if (
        [
            infoParams.isParamsObject,
            infoParams.isRulesObject,
        ].some((item) => item === false) ||
        [
            infoParams.rulesMissing,
            infoParams.rulesExtra,
            infoParams.rulesNotObject,
            infoParams.rulesTypeNotValid,
            infoParams.rulesValidatorNotValid,
            infoParams.rulesNotPassed,
        ].some((item) => item.length > 0)
    ) {
        console.warn(new Error('Errors:'), infoParams);
        return false;
    }
    return true;
};

Object.freeze(checkParams);
export default checkParams;
