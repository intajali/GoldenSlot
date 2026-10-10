import { WeightedSymbol } from "../../game/symbols/models/WeightedSymbol";
import { SymbolLookup } from "../../game/symbols/SymbolLookup";
import { IReelStripConfig } from "../interfaces/reel/IReelStripConfig";
import { ReelConfigModel } from "../models/ReelConfigModel";


export class ReelConfigParser {
    static parse(jsonData: ReelConfigModel): any {
        const reels: IReelStripConfig[] = jsonData.reels.map((reel: any) => {

            const strip: WeightedSymbol[] = reel.strip.map((entry: any) => {

                const symbolModel = SymbolLookup.get(entry.id);

                return new WeightedSymbol(
                    symbolModel,
                    entry.weight,
                    entry.isHighPay
                );
            });

            return {
                index: reel.index,
                strip
            };
        });

        return { reels };
    }
}

