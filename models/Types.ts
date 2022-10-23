import Month from "./Month";
import Pot from "./Pot";

export enum Layout {
    Income,
    Expenditure
}

export enum FirestoreDocuments {
    Pot = 'moneypot',
    Income = 'income',
}

export enum Keyboard {
    Enter = 13
}

export type tuple = [string, number];

export type Props = {
    pot?: Pot,
    month?: Month
    monthId?: string
}