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

class LiquidKindClass implements LiquidKind {
    creationDate: number;
    description: string;
    id: string;
    value: number;
    constructor(id, description, value, creationDate) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.creationDate = creationDate;
    }

}

export const LiquidKindConverter = {
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new LiquidKindClass(data.id, data.description, data.value, data.creationDate);
    }
};