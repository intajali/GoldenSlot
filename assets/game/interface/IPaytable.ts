import { PaytableTierEnum } from "../../core/models/PaytableTierEnum";
import { IPaytableTier } from "./IPaytableTier";

export interface IPaytable {
    getPayout(symbolId: string, count: number): number;
    getTier(tier: PaytableTierEnum): IPaytableTier | undefined;
}


