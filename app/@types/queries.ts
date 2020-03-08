export interface AccountBalanceDetails
{
    id: number,
    categoriename: string,
    name: string,
    amount: number,
    ispositive: boolean,
    timeStamp:Date
}

export interface AccountBalance
{
    month?: number,
    spend: number,
    income:number,
    sum:number,
    ispositive?: boolean
}

export interface Categorie
{
    name: string,
    amount: number,
    ispositive: boolean
    timeStamp:Date
}
