const express = require('express');
const router = express.Router();
const billsController = require('../controllers/user-bills');

router.post('/bills', billsController.createBill);
router.get('/bills', billsController.getAllBills);
router.get('/bills/:id', billsController.getBillById);
router.put('/bills/:id', billsController.updateBill);
router.delete('/bills/:id', billsController.deleteBill);
router.get('/download', billsController.downloadBill);

module.exports = router;
