export default interface FareCalculator {
    calculate(distance: number): number;
}

export class NormalFareCalculator implements FareCalculator {
     calculate(distance: number): number {
        const fareTax = 2.1;
        return distance * fareTax;
     }
}

export class OvernightFareCalculator implements FareCalculator {
    calculate(distance: number): number {
        const fareTax = 4.2;
        return distance * fareTax;
    }    
}

export class FareCalculatorFactory {
    static create(date: Date) {
        if(date.getHours() > 22) return new OvernightFareCalculator();
        if(date.getHours() <= 22) return new NormalFareCalculator();
        throw new Error();
    }
}