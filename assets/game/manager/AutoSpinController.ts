export class AutoSpinController {
    private enabled = false;
    private count = 0;

    enable(count: number): void {
        this.enabled = true;
        this.count = count;
    }

    disable(): void {
        this.enabled = false;
        this.count = 0;
    }

    consume(): void {
        if (this.count > 0) this.count--;
        if (this.count === 0) this.disable();
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    getCount(): number {
        return this.count;
    }
}
