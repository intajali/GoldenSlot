import { RawSymbolPaytable } from "./MatchPayout";

export class PaytableDataModel {
    paytable: {
        NO_PAY: RawSymbolPaytable;
        LOW: RawSymbolPaytable;
        HIGH: RawSymbolPaytable;
        SPECIAL: RawSymbolPaytable;
    };
}

