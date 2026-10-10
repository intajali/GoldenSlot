
import { IPaylineProvider } from '../../core/interfaces/IPaylineProvider';
import { PaylinesDataModel } from '../../core/models/PaylinesDataModel';
import { PaylineValidator } from '../../core/utils/PaylineValidator';

export class Payline implements IPaylineProvider {
    private paylines: number[][];

    constructor(
        config: PaylinesDataModel,
        reelCount: number,
        rowCount: number
    ) {
        try {
            PaylineValidator.validate(config.paylines, reelCount, rowCount);
            this.paylines = config.paylines;
        } catch (e) {

        }
    }

    getPaylines(): number[][] {
        return this.paylines.map(line => [...line]);
    }

}

