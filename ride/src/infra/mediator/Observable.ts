import DomainEvent from "../../domain/event/DomainEvent";

export default class Observable {

    observers: { eventName: string, callBack: Function }[];

    constructor() {
        this.observers = [];
    }

    register(eventName: string, callBack: Function) {
        this.observers.push({ eventName, callBack });    
    }

    async notify(event: DomainEvent) {
        for(const observer of this.observers) {
            if(observer.eventName === event.eventName) {
                await observer.callBack(event);
            }
        }
    }

}