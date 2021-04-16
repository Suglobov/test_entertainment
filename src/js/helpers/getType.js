export default (value) => {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    const valuePrototype = Object.getPrototypeOf(value);
    if (valuePrototype === null) {
        return Object;
    }
    return valuePrototype.constructor;
};
