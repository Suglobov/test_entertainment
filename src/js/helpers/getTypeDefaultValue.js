import checkValueType from './checkValueType.js';

export default (Type) => {
    if (Type === undefined || Type === null) {
        return Type;
    }
    if (checkValueType(Type, Function) && checkValueType(Type.prototype, Object)) {
        try {
            return new Type();
        } catch (error) {
            try {
                return Type();
            } catch (error) { }
        }
    }

    console.warn(`type: ${Type && Type.name} not correct`);
};
