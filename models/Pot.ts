export default interface Pot {
    id: string,
    uid: string,
    name: string,
    creation_date: number,
    goal: number,
    resetDate?: number,
    takeOverValue?: number,
    description?: string
}