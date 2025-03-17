export class ArrayStats extends Array {
    average() {
        const averageValue = this.reduce((a, b) => a + b, 0) / this.length;
        Object.defineProperty(this, "avgVal", {
            value: averageValue, // add new property of the array
            writable: false // set avgVal as immutable
        });
        return averageValue;
    }

    mapperVariance(currentVal) {
        return (currentVal - this.avgVal) ** 2;
    }

    stdev() {
        // Calculate average if not already done
        if (!this.avgVal) this.average();
        
        // Initialize standard deviation accumulator
        this.sdevVal = 0;

        // Use .map() to calculate variance and sum it
        let varianceSum = 0;
        this.map(function(currentVal) {
            varianceSum += this.mapperVariance(currentVal);
        }, this); // Pass `this` as `thisArg` to ensure correct context

        // Compute the standard deviation
        const variance = varianceSum / (this.length - 1);
        const stdevValue = Math.sqrt(variance);

        // Store the computed standard deviation
        Object.defineProperty(this, "sdevVal", {
            value: stdevValue,
            writable: false
        });

        return stdevValue;
    }
}