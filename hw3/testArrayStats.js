import {ArrayStats} from './hw3.js';

// Test the ArrayStats class
const testArrayStats = () => {
    const testArray = new ArrayStats(7, 11, 5, 14);
    console.log("Input Array:", testArray);

    // Test the average method
    const avg = testArray.average();
    console.log("Average:", avg); // Expected: 9.25

    // Test the stdev method
    const stdev = testArray.stdev();
    console.log("Standard Deviation:", stdev); // Expected: 4.3493 (approx)
};

// Run the test function
testArrayStats();
