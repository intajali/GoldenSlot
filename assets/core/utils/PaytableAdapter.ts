import { Paytable } from "../../game/results/Paytable";
import { PaytableTierData } from "../../game/results/PaytableTierData";
import { MatchPayout, RawSymbolPaytable } from "../models/MatchPayout";
import { PaytableDataModel } from "../models/PaytableDataModel";
import { PaytableTierEnum } from "../models/PaytableTierEnum";

const PAYTABLE_TIERS: PaytableTierEnum[] = [
    PaytableTierEnum.NO_PAY,
    PaytableTierEnum.LOW,
    PaytableTierEnum.HIGH,
    PaytableTierEnum.SPECIAL,
    PaytableTierEnum.JACKPOT
];

export class PaytableAdapter {

    static fromJson(raw: PaytableDataModel): Paytable {

        const tierMap = new Map<PaytableTierEnum, PaytableTierData>();

        for (const tierKey of PAYTABLE_TIERS) {
            const rawTier = raw.paytable[tierKey];
            tierMap.set(
                tierKey,
                new PaytableTierData(
                    this.normalizeMatchPayout(rawTier)
                )
            );
        }

        return new Paytable(tierMap);
    }

    /**
     * Convert {3,4,5} payouts → {1..5} domain-safe payouts
     */
    static normalizeMatchPayout(
        rawTier: RawSymbolPaytable
    ): Record<string, MatchPayout> {

        const normalized: Record<string, MatchPayout> = {};

        for (const symbol in rawTier) {
            const raw = rawTier[symbol];

            normalized[symbol] = {
                1: raw["1"] ?? 0,
                2: raw["2"] ?? 0,
                3: raw["3"] ?? 0,
                4: raw["4"] ?? 0,
                5: raw["5"] ?? 0,
            };
        }

        return normalized;
    }
}
