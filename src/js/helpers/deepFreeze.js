export default (object) => {
    const iter = (iterObject) => {
        if (Object.isFrozen(iterObject) === false) {
            Object.freeze(iterObject);
        }
        Object.keys(iterObject).forEach((key) => {
            if (
                iterObject[key] instanceof Object ||
                (typeof iterObject[key] === 'object' && iterObject[key] !== null)
            ) {
                iter(iterObject[key]);
            }
        });
    };
    iter(object);
};