export interface PaymentGateway {
    processPayment(input: Input): Promise<void>;
}

type Input = {
    rideId: string,
    amount: number
}