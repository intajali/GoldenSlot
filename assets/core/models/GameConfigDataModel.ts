export class GameConfigDataModel {

    public gameConfig;
    public reelData;
    public paylineConfig;
    public paytableData;
    public betConfig;
    constructor(
        gameConfig,
        betConfig,
        reelData,
        paylineConfig,
        paytableData,
    ) {
        this.gameConfig = gameConfig;
        this.reelData = reelData;
        this.paylineConfig = paylineConfig;
        this.paytableData = paytableData;
        this.betConfig = betConfig;
    }
}