export class Inventory {
    constructor(
        public capacity: number,
        public water: number = 0,
        public sugar: number = 0,
    ) {
        this.validate();
    }

    public give(other: Inventory, amountWater: number, amountSugar: number) {
        if (other === this) {
            throw new Error("shouldn't give to self");
        }
        // to check:
        // 1) we have enough water and sugar
        //      if we don't, cap water and sugar to the amount available
        // 2) other has enough space
        //      if it doesn't, scale down to the amount that is available
        let water = Math.min(amountWater, this.water);
        let sugar = Math.min(amountSugar, this.sugar);
        const spaceNeeded = water + sugar;
        if (spaceNeeded > other.space()) {
            const capacity = other.space();
            // scale down the amount to give
            // give less than capacity
            water = Math.floor(water / spaceNeeded * capacity);
            sugar = Math.floor(sugar / spaceNeeded * capacity);
        }
        this.change(-water, -sugar);
        other.change(water, sugar);
        return {water, sugar};
    }

    public change(water: number, sugar: number) {
        this.validate(this.water + water, this.sugar + sugar);
        this.water += water;
        this.sugar += sugar;
    }

    public space() {
        const { capacity, water, sugar } = this;
        return capacity - water - sugar;
    }

    validate(water: number = this.water, sugar: number = this.sugar) {
        const { capacity } = this;
        // if (Math.floor(water) !== water) {
        //     throw new Error("water isn't an integer: " + water);
        // }
        // eh fuck it
        // if (Math.floor(sugar) !== sugar) {
        //     throw new Error("sugar isn't an integer: " + sugar);
        // }
        if (water < 0) {
            throw new Error(`water < 0: ${water}`);
        }
        if (sugar < 0) {
            throw new Error(`sugar < 0: ${sugar}`);
        }
        if (water + sugar > capacity) {
            throw new Error(`bad inventory: ${water} water + ${sugar} > ${capacity} max`);
        }
    }
}

export interface HasInventory {
    inventory: Inventory;
}

export function hasInventory(obj: any): obj is HasInventory {
    return obj.inventory instanceof Inventory;
}
