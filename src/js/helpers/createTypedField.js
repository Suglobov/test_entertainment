import checkValueType from './checkValueType.js';
import getTypeDefaultValue from './getTypeDefaultValue.js';

export default ({ object, fieldName, type, initValue }) => {
    if (type === undefined || type === null) {
        console.warn(new Error('type is not defined'));
    }
    const typeSymbol = Symbol(`${fieldName}Type`);
    try {
        object[typeSymbol] = type;

        let value;
        if (checkValueType(initValue, type)) {
            value = initValue;
        } else {
            value = getTypeDefaultValue(type);
        }

        Object.defineProperty(object, fieldName, {
            enumerable: true,
            get: () => value,
            set (newValue) {
                if (checkValueType(newValue, type)) {
                    value = newValue;
                }
            },
        });
    } catch (error) {
        console.error(error);
    }
};
