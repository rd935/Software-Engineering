const {sumRange, averageRange, minRange, maxRange, getRange, spreadsheet} = require('../../hw2');

describe("Spreadsheet Formula Tests", () => {
    beforeEach(() => {
        // Set up the spreadsheet with test data
        spreadsheet.clear();
        spreadsheet.set('A1', '10');
        spreadsheet.set('A2', '20');
        spreadsheet.set('A3', '30');
        spreadsheet.set('A4', '40');
        spreadsheet.set('B1', '5');
        spreadsheet.set('B2', '15');
        spreadsheet.set('B3', '25');
        spreadsheet.set('B4', '35');
    });

    it("should calculate the SUM of a range correctly", () => {
        const cells = getRange('A1:A4'); // should return ['A1', 'A2', 'A3', 'A4']
        const result = sumRange(cells);
        expect(result).toBe(100); // 10 + 20 + 30 + 40
    });

    it("should calculate the AVERAGE of a range correctly", () => {
        const cells = getRange('B1:B4'); // should return ['B1', 'B2', 'B3', 'B4']
        const result = averageRange(cells);
        expect(result).toBe(20); // (5 + 15 + 25 + 35) / 4
    });

    it("should find the MIN value of a range correctly", () => {
        const cells = getRange('A1:A4');
        const result = minRange(cells);
        expect(result).toBe(10); // minimum of 10, 20, 30, 40
    });

    it("should find the MAX value of a range correctly", () => {
        const cells = getRange('A1:A4');
        const result = maxRange(cells);
        expect(result).toBe(40); // maximum of 10, 20, 30, 40
    });

    it("should return null for MIN if the range is empty", () => {
        const cells = getRange('A5:A5'); // non-existing cell
        const result = minRange(cells);
        expect(result).toBeNull();
    });

    it("should return null for MAX if the range is empty", () => {
        const cells = getRange('A5:A5'); // non-existing cell
        const result = maxRange(cells);
        expect(result).toBeNull();
    });
});
