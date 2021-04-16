export default (value) => {
    const defaultIsNaN = 0;
    const out = Object.create(null);
    out.input = value;
    out.integer = value;
    out.isInteger = true;
    out.isNaN = false;

    if (Number.isInteger(value) === false) {
        const int = parseInt(String(value), 10);
        out.isInteger = false;
        out.isNaN = Number.isNaN(int);
        out.integer = out.isNaN ? defaultIsNaN : int;
    }

    Object.freeze(out);
    return out;
};