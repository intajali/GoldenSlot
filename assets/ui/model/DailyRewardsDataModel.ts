
export class DailyRewardsDataModel {
    amount: number;
    claimed: boolean;
    locked: boolean;
    day: number;
    lastClaimDate: string;

    constructor(amount: number, claimed: boolean, locked: boolean, day: number, lastClaimDate: string) {
        this.amount = amount;
        this.claimed = claimed;
        this.locked = locked;
        this.day = day;
        this.lastClaimDate = lastClaimDate;
    }


    // Helper function to check if the reward can be claimed today
    canClaimToday(): boolean {
        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        return this.lastClaimDate !== currentDate;
    }

    // Update the claim date
    updateClaimDate() {
        this.lastClaimDate = new Date().toISOString().split('T')[0]; // Set the current date
    }
}

