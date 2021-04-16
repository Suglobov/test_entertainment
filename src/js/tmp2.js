import SafePredictableClassCreator from './helpers/SafePredictableClassCreator.js';


const TestClass = new SafePredictableClassCreator({
    propsLocal: {
        loc1: { type: String },
    },
    propsPub: {
        pub1: { type: Number, initValue: 1 },
        pub2: { type: String },
    },
    params: {
        constructor: {
            test1: { type: Object },
            'test1.z': { type: Number, validator: (value) => value < 100 },
        },
        mt1: {
            newValue: { type: String },
        },
    },
    methodsPub: {
        constructor ({ test1 }) {
            // console.log('test1', test1);
            this.pub1.value = test1.z;
        },
        mt1 ({ newValue }) {
            this.pub2.value = newValue;
        },
        mt2: function () {
            // console.log(x, this);
        },
    },
});

const EventsStorage = new SafePredictableClassCreator({
    classConstructorName: 'EventsStorage',
    propsLocal: {
        eventList: { type: Array, initValue: [] },
    },
    propsPub: {
        eventNameList: { type: Array, initValue: [] },
        // pub2: { type: String },
    },
    params: {
        constructor: {
            eventNameList: { type: Array },
        },
        on: {
            eventName: {
                type: String,
                validator (eventName) {

                },
            },
            eventHandler: {
                type: Function,
                validator (eventHandler) {

                },
            },
        },
    },
    methodsPub: {
        constructor ({ test1 }) {
            // console.log('test1', test1);
            this.pub1.value = test1.z;
        },
        on ({ eventName, eventHandler }) {
            // this.pub2.value = newValue;
        },
        off () {
            // console.log(x, this);
        },
        emit () {
        },
    },
});

const testInstance = new TestClass({ test1: { z: 80 } });
testInstance.mt1({ newValue: '15' });
testInstance.mt2();
window.TestClass = TestClass;
window.testInstance = testInstance;

// const Test10 = class {
//     constructor () {
//         this.a = 2;
//     }
// };
// const test1 = () => {
//     const zzz = class {
//         constructor () {
//             this.z = 1;
//         }
//     };
//     return zzz;
// };
// const Test2 = test1();
// const test3 = new Test2();
// const test11 = new Test10();
// console.log('test11', test11);
// console.log('test3', test3);
