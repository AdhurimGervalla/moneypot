
export interface LiquidKind {
    id: string,
    description: string,
    value: number,
    creationDate: number,
    monthly?: boolean,
    sorting?: number,
}

export interface RepeatingExpenditures extends LiquidKind {
    interval?: number
}