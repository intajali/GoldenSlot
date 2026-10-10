export type MatchCount = 1 | 2 | 3 | 4 | 5;

export interface MatchPayout {
    [count: number]: number;
}

export type SymbolId = string;

export type RawSymbolPaytable = Record<string, MatchPayout>;
