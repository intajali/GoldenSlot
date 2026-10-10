
export class PaylineValidator {
    static validate(paylines: number[][],
        reelCount: number,
        rowCount: number) {
        paylines.forEach((line, index) => {

            if (line.length !== reelCount) {
                throw new Error(
                    `Payline ${index} must have ${reelCount} reels`
                );
            }

            line.forEach(row => {
                if (row < 0 || row >= rowCount) {
                    throw new Error(
                        `Invalid row index ${row} in payline ${index}`
                    );
                }
            });

        });
    }
}

