import deepFreeze from './deepFreeze.js';
import getType from './getType.js';


const getTypeDefault = (Type) => {
    if (Type === undefined || Type === null) {
        return Type;
    }
    if (Type instanceof Function) {
        try {
            return new Type();
        } catch (error) {
            try {
                return Type();
            } catch (error) { }
        }
    }

    console.warn(`type: ${Type} not correct`);
};

const checkValueType = (value, Type) => {
    const valueType = getType(value);
    if (valueType === Type) {
        return true;
    }
    console.warn(new Error(`Error value type: (${value}) is type '${valueType && valueType.name}', need type '${Type && Type.name}'.`));
    return false;
};


const createSetterTypedValue = (object, fieldName, type) => {
    if (type === undefined || type === null) {
        console.warn(new Error('type is not defined'));
    }
    // Object.defineProperty(this, 'type', {
    //         enumerable: true,
    //         get: () => type,
    // })
    checkParams(object, Object);
    // const currentInitValue = initValue === undefined ? getTypeDefault(this.type) : initValue;
    // let value = checkValueType(currentInitValue, this.type) ? currentInitValue : getTypeDefault(this.type);

    let value;

    Object.defineProperty(object, fieldName, {
        enumerable: true,
        get: () => value,
        set (newValue) {
            if (checkValueType(newValue, type)) {
                value = newValue;
            }
        },
    });
};


const TypedValue = class {
    constructor ({ type, initValue } = {}) {
        if (type === undefined || type === null) {
            console.warn(new Error('type is not defined'));
        }
        Object.defineProperty(this, 'type', {
            enumerable: true,
            get: () => type,
        });

        const currentInitValue = initValue === undefined ? getTypeDefault(this.type) : initValue;
        let value = checkValueType(currentInitValue, this.type) ? currentInitValue : getTypeDefault(this.type);

        Object.defineProperty(this, 'value', {
            enumerable: true,
            get: () => value,
            set (newValue) {
                if (checkValueType(newValue, this.type)) {
                    value = newValue;
                }
            },
        });

        deepFreeze(this);
    }
};

const getObjectFlatKeys = (incomeObject) => {
    const typesForIterCall = [Object, Function];
    const outObject = {};
    const iter = (iterObject, prefixKey) => {
        Object.entries(iterObject).forEach(([iterKey, iterValue]) => {
            const currentPrefix = prefixKey === '' ? '' : `${prefixKey}.`;
            const iterPrefixKey = `${currentPrefix}${iterKey}`;
            outObject[iterPrefixKey] = iterValue;

            const iterValueType = getType(iterValue);
            if (typesForIterCall.includes(iterValueType)) {
                iter(iterValue, iterPrefixKey);
            }
        });
    };
    iter(incomeObject || {}, '');
    return outObject;
};

// console.log(getObjectFlatKeys());
// console.log(getObjectFlatKeys([]));
// console.log(getObjectFlatKeys({ x: [1, 2, 3] }));

const checkParams = (params, rules) => {
    if (params === undefined && rules === undefined) {
        return true;
    }

    let isPassed = true;

    if (checkValueType(params, Object) === false) {
        isPassed = false;
    }
    if (checkValueType(rules, Object) === false) {
        isPassed = false;
    }

    const paramsFlat = getObjectFlatKeys(params || {});
    const paramsFlatKeys = Object.keys(paramsFlat || {});
    const rulesKeys = Object.keys(rules || {});

    const paramsFlatKeysExcess = paramsFlatKeys.filter((el) => !rulesKeys.includes(el));
    if (paramsFlatKeysExcess.length > 0) {
        console.warn(new Error(`there are fields without checks: ${paramsFlatKeysExcess.join(', ')}`));
        isPassed = false;
    }

    const rulesKeysExcess = rulesKeys.filter((el) => !paramsFlatKeys.includes(el));
    if (rulesKeysExcess.length > 0) {
        console.warn(new Error(`there are extra checks: ${rulesKeysExcess.join(', ')}`));
        isPassed = false;
    }


    Object.entries(rules || {}).forEach(([fieldName, rule]) => {
        if (rulesKeysExcess.includes(fieldName)) {
            return;
        }

        if (checkValueType(rules, Object) === false) {
            isPassed = false;
            return;
        }

        const value = paramsFlat[fieldName];

        if (checkValueType(value, rule.type) === false) {
            isPassed = false;
        }

        const validatorType = getType(rule.validator);

        // TODO плохое условие. Надо поправить, чтоб не было ошибок на validator === undefined
        if (checkValueType(validatorType, Function)) {
            const isValuePassed = Boolean(rule.validator(value));
            if (isValuePassed === false) {
                console.warn(new Error(`value (${value}) did not pass validation`));
                isPassed = false;
            }
        } else if (checkValueType(validatorType, undefined) === false) {
            isPassed = false;
        }
    });

    return isPassed;
};


const SafePredictableClassCreator = class {
    constructor (options = {}) {
        const { propsLocal, propsPub, params, methodsPub } = options;

        const provenMethodsPub = Object.fromEntries(
            Object.entries(methodsPub || {})
                .filter(([methodName, method]) => {
                    const methodType = getType(method);
                    if (methodType !== Function) {
                        console.warn(new Error(`method ${methodName} not a function`));
                        return false;
                    }
                    return true;
                }));

        const SafePredictableClass = class {
            constructor (incomeParams) {
                const stock = {};

                Object.entries(propsLocal || {}).forEach(([key, value]) => {
                    stock[key] = new TypedValue(value);
                });

                Object.entries(propsPub || {}).forEach(([key, value]) => {
                    stock[key] = new TypedValue(value);
                    Object.defineProperty(this, key, {
                        enumerable: true,
                        get: () => stock[key].value,
                    });
                });


                if (checkParams(incomeParams, params.constructor)) {
                    provenMethodsPub.constructor && provenMethodsPub.constructor.call(stock, incomeParams);
                }

                Object.entries(provenMethodsPub).forEach(([methodName, method]) => {
                    if (methodName === 'constructor') {
                        return;
                    }
                    this[methodName] = function (...args) {
                        if (checkParams(args[0], params[methodName])) {
                            method.call(stock, args[0]);
                        }
                    };
                });


                deepFreeze(stock);
                deepFreeze(this);
            }
        };

        return SafePredictableClass;
    }
};

deepFreeze(SafePredictableClassCreator);
export default SafePredictableClassCreator;