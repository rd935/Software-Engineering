const { isCSVFile, printCSV, calculateColumnWidths, formatAndPrintRows } = require('../../hw1');

describe("CSV Printer Utility Functions", () => {

    // Test for CSV file type validation
    describe("isCSVFile", () => {
        it("should return true for a valid .csv file", () => {
            const filePath = "data/example.csv";
            expect(isCSVFile(filePath)).toBe(true);
        });

        it("should return false for a file with a different extension", () => {
            const filePath = "data/example.txt";
            expect(isCSVFile(filePath)).toBe(false);
        });

        it("should throw an error when attempting to process a non-csv file", () => {
            const filePath = "data/example.txt";
            
            // Mock fs and readline to avoid file I/O during the test
            spyOn(console, 'error');
            
            expect(() => {
                printCSV(filePath);
            }).toThrowError("Invalid file type. Only CSV files are supported.");
        });
    });

    // Test for calculateColumnWidths
    describe("calculateColumnWidths", () => {
        it("should correctly calculate the maximum width for each column", () => {
            const rows = [
                ["Name", "Age", "Occupation"],
                ["John Doe", "28", "Software Engineer"],
                ["Jane Smith", "34", "Data Scientist"],
                ["Michael Brown", "45", "Product Manager"]
            ];

            const expectedWidths = [15, 5, 19]; // Max length + 2 padding
            const result = calculateColumnWidths(rows);

            expect(result).toEqual(expectedWidths);
        });

        it("should handle empty columns", () => {
            const rows = [
                ["Name", "Age", "Occupation"],
                ["John Doe", "", "Software Engineer"],
                ["Jane Smith", "34", ""],
                ["", "45", "Product Manager"]
            ];

            const expectedWidths = [12, 5, 19]; // Max length + 2 padding
            const result = calculateColumnWidths(rows);

            expect(result).toEqual(expectedWidths);
        });
    });

    // Test for formatAndPrintRows
    describe("formatAndPrintRows", () => {
        it("should print the rows correctly formatted based on column widths", () => {
            const rows = [
                ["Name", "Age", "Occupation"],
                ["John Doe", "28", "Software Engineer"],
                ["Jane Smith", "34", "Data Scientist"]
            ];

            const columnWidths = [12, 4, 18]; // Pre-calculated
            const expectedOutput = [
                "| Name         | Age  | Occupation         |",
                "| John Doe     | 28   | Software Engineer  |",
                "| Jane Smith   | 34   | Data Scientist     |"
            ];

            spyOn(console, 'log'); // Mock console.log

            formatAndPrintRows(rows, columnWidths);

            expectedOutput.forEach((line, index) => {
                expect(console.log.calls.argsFor(index)[0]).toEqual(line);
            });
        });

        it("should handle empty rows gracefully", () => {
            const rows = [
                ["Name", "Age", "Occupation"],
                ["John Doe", "", "Software Engineer"],
                ["", "34", ""]
            ];

            const columnWidths = [12, 4, 18]; // Pre-calculated
            const expectedOutput = [
                "| Name         | Age  | Occupation         |",
                "| John Doe     |      | Software Engineer  |",
                "|              | 34   |                    |"
            ];

            spyOn(console, 'log'); // Mock console.log

            formatAndPrintRows(rows, columnWidths);

            expectedOutput.forEach((line, index) => {
                expect(console.log.calls.argsFor(index)[0]).toEqual(line);
            });
        });
    });
});
