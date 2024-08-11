const conn = require('../config/config.js');
const ExcelJS = require('exceljs');

// Function to validate bill data.
function validateBillData(billData) {
    const { bill_number, customer_id, bill_date, amount, status, payment_due_date, payment_method } = billData;
    
    if (!bill_number || typeof bill_number !== 'string' || bill_number.trim() === '') {
        return { error: 'Invalid or missing bill_number' };
    }
    if (isNaN(customer_id) || customer_id <= 0) {
        return { error: 'Invalid or missing customer_id' };
    }
    if (!bill_date || isNaN(new Date(bill_date).getTime())) {
        return { error: 'Invalid or missing bill_date' };
    }
    if (isNaN(amount) || amount < 0) {
        return { error: 'Invalid or missing amount' };
    }
    if (!status || typeof status !== 'string' || status.trim() === '') {
        return { error: 'Invalid or missing status' };
    }
    if (!payment_due_date || isNaN(new Date(payment_due_date).getTime())) {
        return { error: 'Invalid or missing payment_due_date' };
    }
    if (!payment_method || typeof payment_method !== 'string' || payment_method.trim() === '') {
        return { error: 'Invalid or missing payment_method' };
    }
    // if(bill_date < payment_due_date) {
    //     return { error: 'Payment Due Date cannot be earlier than Bill Date' };
    // }
    return null;
}

// Function to get all bills.
async function getAllBillsService() {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM bills', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

// Function to get a bill by ID.
async function getBillByIdService(id) {
    return new Promise((resolve, reject) => {
        if (isNaN(id) || id <= 0) return reject(new Error('Invalid bill ID'));
        conn.query('SELECT * FROM bills WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error('Bill not found'));
            resolve(results[0]);
        });
    });
}

// Function to create a new bill.
async function createBillService(billData) {
    const validationError = validateBillData(billData);
    if (validationError) {
        return Promise.reject(validationError);
    }
    const { bill_number, customer_id, bill_date, amount, status, payment_due_date, payment_method } = billData;
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO bills (bill_number, customer_id, bill_date, amount, status, payment_due_date, payment_method) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        conn.query(query, [bill_number, customer_id, bill_date, amount, status, payment_due_date, payment_method], (err, results) => {
            if (err) return reject(err);
            resolve({ id: results.insertId, ...billData });
        });
    });
}

// Function to update an existing bill.
async function updateBillService(id, billData) {
    if (isNaN(id) || id <= 0) {
        console.error('Invalid bill ID:', id);
        return Promise.reject({ error: 'Invalid bill ID' });
    }
    
    const validationError = validateBillData(billData);
    if (validationError) {
        console.error('Validation Error:', validationError);
        return Promise.reject(validationError);
    }

    const { bill_number, customer_id, bill_date, amount, status, payment_due_date, payment_method } = billData;

    return new Promise((resolve, reject) => {
        try {
            const query = `
                UPDATE bills 
                SET bill_number = ?, customer_id = ?, bill_date = ?, amount = ?, status = ?, payment_due_date = ?, payment_method = ? 
                WHERE id = ?`;
            
            conn.query(query, [bill_number, customer_id, bill_date, amount, status, payment_due_date, payment_method, id], (err, results) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        console.error('Duplicate entry for bill_number:', bill_number);
                        return reject(new Error('The bill number already exists.'));
                    }
                    console.error('Database query error:', err);
                    return reject(err);
                }
                if (results.affectedRows === 0) {
                    return reject(new Error('Bill not found'));
                }
                resolve({ id, ...billData });
            });
        } catch (err) {
            console.error('Caught Error:', err);
            return reject(err);
        }
    });
}


// Function to delete a bill by ID.
async function deleteBillService(id) {
    return new Promise((resolve, reject) => {
        if (isNaN(id) || id <= 0) return reject(new Error('Invalid bill ID'));
        conn.query('DELETE FROM bills WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            if (results.affectedRows === 0) return reject(new Error('Bill not found'));
            resolve({ message: 'Bill deleted successfully' });
        });
    });
}

// Function to download bill Excel sheet
async function downloadBillService(req, res) {
    try {
        const [rows] = await conn.promise().query('SELECT * FROM bills');

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Bills');

        worksheet.columns = [
            { header: 'ID', key: 'id' },
            { header: 'Bill Number', key: 'bill_number' },
            { header: 'Customer ID', key: 'customer_id' },
            { header: 'Bill Date', key: 'bill_date' },
            { header: 'Amount', key: 'amount' },
            { header: 'Status', key: 'status' },
            { header: 'Payment Due Date', key: 'payment_due_date' },
            { header: 'Payment Method', key: 'payment_method' }
        ];

        rows.forEach((row) => {
            worksheet.addRow(row);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    } catch (error) {
        console.log(error);
        res.status(500).send('Failed to download bill data');
    }
}

module.exports = {
    getAllBillsService,
    getBillByIdService,
    createBillService,
    updateBillService,
    deleteBillService,
    downloadBillService
};
