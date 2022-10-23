export default interface Pot {
    id: string,
    uid: string,
    name: string,
    creation_date: number,
    goal: number,
    incomes?: string,
    expenditures?: string,
    resetDate?: number,
    takeOverValue?: number,
    description?: string,
    looping?: boolean,
}

export type Props = {
    pot: Pot
}