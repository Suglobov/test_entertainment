import getType from './getType.js';

export default (value, Type) => {
    const valueType = getType(value);
    if (valueType === Type) {
        return true;
    }
    console.warn(new Error(`Type error: (${value}) is type '${valueType && valueType.name}', need type '${Type && Type.name}'`));
    return false;
};
