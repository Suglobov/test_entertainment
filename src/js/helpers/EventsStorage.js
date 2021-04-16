import deepFreeze from './deepFreeze.js';
import getType from './getType.js';


const checkEventNameListType = (eventNameList) => {
    const eventNameListType = getType(eventNameList);
    if (eventNameListType === Array) {
        return true;
    }
    console.warn(new Error(`'${eventNameList}' eventNameList must be an Array`));
    return false;
};
const checkEventNameType = (eventName) => {
    const eventNameType = getType(eventName);
    if (eventNameType === String) {
        return true;
    }
    console.warn(new Error(`'${eventName}' eventName must be a String, but ${eventNameType && eventNameType.name}`));
    return false;
};
const checkEventNamePossible = (eventList, eventName) => {
    if (eventList[eventName] === undefined) {
        console.warn(new Error(`'${eventName}' eventName not possible`));
        return false;
    }
    return true;
};
const checkEventNameDuplicate = (eventList, eventName) => {
    if (eventList[eventName] === undefined) {
        return true;
    }
    console.warn(new Error(`'${eventName}' eventName duplicate`));
    return false;
};
const checkEventHandlerType = (eventHandler) => {
    const eventHandlerType = getType(eventHandler);
    if (eventHandlerType === Function) {
        return true;
    }
    console.warn(new Error(`'${eventHandler}' eventName must be a Function, but ${eventHandlerType && eventHandlerType.name}`));
    return false;
};
const checkEventHandlerDuplicate = (eventList, eventName, eventHandler) => {
    if (eventList[eventName].every((handler) => handler !== eventHandler)) {
        return true;
    }
    console.warn(new Error(`'${eventHandler}' eventHandler duplicate`));
    return false;
};


export default class EventsStorage {
    constructor (eventNameList = []) {
        const eventList = Object.create(null);

        this.eventNameList = undefined;

        this.on = undefined;
        this.off = undefined;
        this.emit = undefined;

        if (checkEventNameListType(eventNameList)) {
            this.eventNameList = eventNameList;
        } else {
            this.eventNameList = [];
        }

        this.eventNameList.forEach((eventName) => {
            if (
                checkEventNameType(eventName) &&
                checkEventNameDuplicate(eventList, eventName)
            ) {
                eventList[eventName] = [];
            }
        });

        this.on = (eventName, eventHandler) => {
            if (
                checkEventNameType(eventName) &&
                checkEventHandlerType(eventHandler) &&
                checkEventNamePossible(eventList, eventName) &&
                checkEventHandlerDuplicate(eventList, eventName, eventHandler)
            ) {
                eventList[eventName].push(eventHandler);
            }
        };

        this.off = (eventName, eventHandler) => {
            if (
                checkEventNameType(eventName) &&
                checkEventHandlerType(eventHandler) &&
                checkEventNamePossible(eventList, eventName)
            ) {
                eventList[eventName] = eventList[eventName].filter((handler) => handler !== eventHandler);
            }
        };

        this.emit = (eventName, ...args) => {
            if (
                checkEventNameType(eventName) &&
                checkEventNamePossible(eventList, eventName)
            ) {
                eventList[eventName].forEach((handler) => handler(...args));
            }
        };

        deepFreeze(this);
    }
}
