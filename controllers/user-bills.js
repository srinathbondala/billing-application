const billService = require('../services/user_billService');

async function getAllBills(req, res) {
    try {
        const bills = await billService.getAllBillsService(); // Get all bills from database
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getBillById(req, res) {
    try {
        const id = req.params.id;
        const bill = await billService.getBillByIdService(id); // Get a bill by ID from database
        res.json(bill);
    } catch (error) {
        if(error.message=="Bill not found"){
            res.status(404).json({message: error.message});
        }
        else if(error.message=="Invalid bill ID")
            res.status(404).json({message: error.message})
        else
            res.status(500).json({ message: error.message });
    }
}

async function createBill(req, res) {
    try {
        const billData = req.body;
        const newBill = await billService.createBillService(billData); // Create a new bill
        res.status(201).json(newBill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateBill(req, res) {
    try {
        const id = req.params.id;
        const billData = req.body;
        const updatedBill = await billService.updateBillService(id, billData); // Update an existing bill
        res.json(updatedBill);
    } catch (error) {
        if(error.message=='The bill number already exists.')
            res.status(422).json({message: error.message});
        else
            res.status(500).json({ message: error.message });
    }
}

async function deleteBill(req, res) {
    try {
        const id = req.params.id;
        const result = await billService.deleteBillService(id); // Delete a bill by ID
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function downloadBill(req, res) {
    try{
        const buffer = await billService.downloadBillService();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=bills.xlsx');
        res.send(buffer);
    } catch(error){
        res.status(500).send('Failed to download bill data');
    }
}

module.exports = {
    getAllBills,
    getBillById,
    createBill,
    updateBill,
    deleteBill,
    downloadBill
};
