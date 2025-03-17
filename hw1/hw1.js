const fs = require('fs');
const readline = require('readline');
const path = require('path'); // Adding path module to check file extension

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

// Function to read and print a CSV file with column widths
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
        const columnWidths = calculateColumnWidths(rows);
        formatAndPrintRows(rows, columnWidths);
        console.log("Finished reading the file.");
        askForFilePath(); // Ask for the next file path
    });

    rl.on('error', (err) => {
        console.error("Error reading the file:", err.message);
        askForFilePath(); // Ask for the next file path even if there's an error
    });
}

// Function to prompt the user for the file path
function askForFilePath() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('\nEnter the CSV file path (or type "exit" to quit): ', (filePath) => {
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

// Start the loop by asking the user for a file path
askForFilePath();

module.exports = { isCSVFile, printCSV, calculateColumnWidths, formatAndPrintRows };
