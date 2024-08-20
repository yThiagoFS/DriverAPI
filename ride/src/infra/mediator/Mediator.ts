export default class Mediator {

    handlers: { eventName: string, callBack: Function }[];

    constructor() {
        this.handlers = [];
    }

    register(eventName: string, callBack: Function) {
        this.handlers.push({ eventName, callBack });    
    }

    async publish(eventName: string, data: any) {
        for(const handler of this.handlers) {
            if(handler.eventName === eventName) {
                await handler.callBack(data);
            }
        }
    }

}