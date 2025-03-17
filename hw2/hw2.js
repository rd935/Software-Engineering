const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Map to store cell data with keys like "A1", "B2"
const spreadsheet = new Map();

// Function to check if the file is a CSV
function isCSVFile(filePath) {
    return path.extname(filePath).toLowerCase() === '.csv';
}

// Function to calculate the max width for each column
function calculateColumnWidths(rows) {
    const columnWidths = [];

    rows.forEach(row => {
        row.forEach((cell, index) => {
            const cellLength = cell.trim().length;
            if (!columnWidths[index] || columnWidths[index] < cellLength) {
                columnWidths[index] = cellLength;
            }
        });
    });

    // Add some padding to each column for spacing
    return columnWidths.map(width => width + 2); // 2 spaces padding
}

// Function to format and print rows with the calculated column widths
function formatAndPrintRows(rows, columnWidths) {
    rows.forEach(row => {
        const formattedRow = row.map((cell, index) => {
            return cell.trim().padEnd(columnWidths[index]);
        });
        console.log('| ' + formattedRow.join(' | ') + ' |');
    });
}


// Function to check if the file is a CSV file
function isCSVFile(filePath) {
    return filePath.endsWith('.csv');
}

// Function to format and print rows in an Excel-like format
function printExcelStyleSpreadsheet(rows) {
    const numRows = rows.length;
    const numCols = rows[0].length;

    // Print column headers (A, B, C, etc.)
    let columnHeaders = '     '; // 5 spaces to align with row numbers
    for (let col = 0; col < numCols; col++) {
        columnHeaders += `  ${String.fromCharCode(65 + col)}  `;
    }
    console.log(columnHeaders);

    // Print each row with row number on the left
    rows.forEach((row, rowIndex) => {
        let rowString = `${(rowIndex + 1).toString().padStart(3, ' ')} |`; // Row number
        row.forEach((cell) => {
            rowString += ` ${cell.trim().padStart(3, ' ')} |`; // Cell value
        });
        console.log(rowString);
    });
}

// Function to read and print a CSV file in an Excel-like format
function printCSV(filePath) {
    if (!isCSVFile(filePath)) {
        throw new Error("Invalid file type. Only CSV files are supported.");
    }

    const rows = [];
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        const cells = line.split(',');
        rows.push(cells);
    });

    rl.on('close', () => {
        printExcelStyleSpreadsheet(rows); // Print the spreadsheet in Excel format

        // Store each cell in the Map
        rows.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellKey = String.fromCharCode(65 + colIndex) + (rowIndex + 1); // Create cell key like "A1"
                const value = parseFloat(cell.trim()); // Convert value to float
                spreadsheet.set(cellKey, value);
            });
        });

        console.log("Finished reading the file.");
        askForFormula(); // Ask for the formula input after reading the CSV
    });

    rl.on('error', (err) => {
        console.error("Error reading the file:", err.message);
        askForFilePath(); // Ask for the next file path even if there's an error
    });
}

// Function to calculate the SUM of a range of cells
function sumRange(range) {
    let sum = 0;
    range.forEach((cell) => {
        const value = parseFloat(spreadsheet.get(cell));
        if (!isNaN(value)) {
            sum += value;
        }
    });
    return sum;
}

// Function to calculate the AVERAGE of a range of cells
function averageRange(range) {
    const total = sumRange(range);
    return total / range.length;
}

// Function to calculate the MIN value of a range of cells
function minRange(range) {
    let min = Infinity;
    range.forEach((cell) => {
        const value = parseFloat(spreadsheet.get(cell));
        if (!isNaN(value)) {
            min = Math.min(min, value);
        }
    });
    return min === Infinity ? null : min;
}

// Function to calculate the MAX value of a range of cells
function maxRange(range) {
    let max = -Infinity;
    range.forEach((cell) => {
        const value = parseFloat(spreadsheet.get(cell));
        if (!isNaN(value)) {
            max = Math.max(max, value);
        }
    });
    return max === -Infinity ? null : max;
}

// Function to get the range of cell keys from a string like "A1:A3"
function getRange(cellRange) {
    const [start, end] = cellRange.split(':');
    const startCol = start[0];
    const startRow = parseInt(start.slice(1));
    const endCol = end[0];
    const endRow = parseInt(end.slice(1));

    const range = [];
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
            const cellKey = String.fromCharCode(col) + row;
            range.push(cellKey);
        }
    }

    return range;
}

// Function to process the formula and calculate the result
function processFormula(formula) {
    if (formula.startsWith('=SUM(')) {
        const range = formula.match(/\(([^)]+)\)/)[1];
        const cells = getRange(range);
        const result = sumRange(cells);
        console.log(`Result of SUM(${range}):`, result);
    } else if (formula.startsWith('=AVERAGE(')) {
        const range = formula.match(/\(([^)]+)\)/)[1];
        const cells = getRange(range);
        const result = averageRange(cells);
        console.log(`Result of AVERAGE(${range}):`, result);
    } else if (formula.startsWith('=MIN(')) {
        const range = formula.match(/\(([^)]+)\)/)[1];
        const cells = getRange(range);
        const result = minRange(cells);
        console.log(`Result of MIN(${range}):`, result);
    } else if (formula.startsWith('=MAX(')) {
        const range = formula.match(/\(([^)]+)\)/)[1];
        const cells = getRange(range);
        const result = maxRange(cells);
        console.log(`Result of MAX(${range}):`, result);
    } else {
        console.log("Unsupported formula. Only =SUM(), =AVERAGE(), =MIN(), =MAX() are supported.");
    }
}

// Function to ask the user for a formula and process it
function askForFormula() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter a formula (e.g., =SUM(), =AVERAGE(), =MIN(), =MAX()) or type "exit" to quit: ', (formula) => {
        if (formula.toLowerCase() === 'exit') {
            console.log("Goodbye!");
            rl.close();
            process.exit(0);
        } else {
            try {
                const result = processFormula(formula);
            } catch (error) {
                console.error("Error calculating formula:", error.message);
            }
            rl.close();
            askForFormula(); // Ask again for another formula
        }
    });
}

// Function to ask the user for a file path and read the CSV file
function askForFilePath() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the CSV file path: ', (filePath) => {
        if (filePath.toLowerCase() === 'exit') {
            console.log("Goodbye!");
            rl.close();
            process.exit(0);
        } else if (fs.existsSync(filePath)) {
            printCSV(filePath); // Print the CSV file if the file exists
            rl.close();
        } else {
            console.error("File not found. Please try again.");
            rl.close();
            askForFilePath(); // Ask again if the file doesn't exist
        }
    });
}

// Start by asking the user for the CSV file path
askForFilePath();

module.exports = {printCSV, getRange, sumRange, averageRange, minRange, maxRange, spreadsheet};
