import LimitedInteger from './LimitedInteger.js';
import checkParams from './helpers/checkParams.js';

const limitedInteger = new LimitedInteger(0, 10);
// window.limitedInteger = limitedInteger;
// console.log('limitedInteger', limitedInteger);
// class Test {
//     constructor() {
//         this.z = 1;
//     }
// }

// const test = Test;
// console.log(test === Test);


class ExtraNumber extends Number { }
class Tmp {
    constructor() {
        this.a = 1;
        this.b = 2;
    }
}
const tmp = new Tmp();
checkParams();
checkParams(1, '');
checkParams({});
checkParams(null, {});
checkParams(Object.create(null), {});
checkParams(
    {
        object: {
            number: 12,
            string: 'string',
            symbol: Symbol(),
            boolean: true,
        },
        extraNumber: new ExtraNumber(),
        tmp,
    },
    {
        object: { type: Object },
        'object.number': { type: Number },
        'object.string': { type: String },
        'object.symbol': { type: Symbol },
        'object.boolean': { type: Boolean },
        extraNumber: { type: Number },
        // extraNumber: { type: ExtraNumber },
        tmp: { type: Tmp, validator: (value) => value.a === 1 },
    }
);


