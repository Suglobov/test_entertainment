import getType from './getType.js';

export default (incomeObject) => {
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
    try {
        iter(incomeObject, '');
    } catch (error) {
        console.error(error);
    }

    return outObject;
};
