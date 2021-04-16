import deepFreeze from './helpers/deepFreeze.js';
import getIntegerInfo from './helpers/getIntegerInfo.js';


export default class {
    constructor(min, max) {
        this.minInfo = getIntegerInfo(min);
        this.min = this.minInfo.integer;
        if (this.minInfo.isInteger === false) {
            console.warn(new Error('min not integer'));
        }

        this.maxInfo = getIntegerInfo(max);
        this.max = this.maxInfo.integer;
        if (this.maxInfo.isInteger === false) {
            console.warn(new Error('max not integer'));
        }

        if (this.minInfo.integer > this.maxInfo.integer) {
            this.min = this.maxInfo.integer;
            this.max = this.minInfo.integer;
            console.warn(new Error('min > max'));
        }

        let _valueInfo;
        let _valueOverflows = Object.create(null);
        let _value;
        Object.defineProperty(this, 'valueInfo', {
            enumerable: true,
            get () {
                return _valueInfo;
            },
        });
        Object.defineProperty(this, 'valueOverflows', {
            enumerable: true,
            get () {
                return _valueOverflows;
            },
        });
        Object.defineProperty(this, 'value', {
            enumerable: true,
            get () {
                return _value;
            },
            set (newValue) {
                _valueInfo = getIntegerInfo(newValue);
                _valueOverflows.isOverflowMin = false;
                _valueOverflows.isOverflowMax = false;
                _value = _valueInfo.integer;

                if (_valueInfo.isInteger === false) {
                    console.warn(new Error('value not integer'));
                }

                if (_valueInfo.integer < this.min) {
                    _valueOverflows.isOverflowMin = true;
                    _value = this.min;
                } else if (_valueInfo.integer > this.max) {
                    _valueOverflows.isOverflowMax = true;
                    _value = this.max;
                }
            },
        });

        this.value = this.min;

        deepFreeze(this);
    }
}
