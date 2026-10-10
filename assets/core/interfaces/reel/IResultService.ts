import { IRNG } from "db://assets/game/services/ResultService";

export interface IResultService {
    generateResult(): number[];
    nextResult(): number[];
    calculateRTPResult(): number[];
    getFreeSpinTestData(): number[];
    getBonusTestData(): number[];
    getJackpotTestData(): number[];
}