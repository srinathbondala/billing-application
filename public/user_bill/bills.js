document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/bills')
        .then(response => response.json())
        .then(data => {
            billdata = data;
            displayCards(data);
            hideloader();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Failed to load data.');
            hideloader();
        });
});

var billdata =[];

function showloader(){
    scrollTo(0,0);
    const overlay = document.getElementById("overshade");
      overlay.style.display = "block";
      document.body.style.overflow = "hidden";
  }
  function hideloader(){
    const overlay = document.getElementById("overshade");
      overlay.style.display = "none";
      document.body.style.overflow = "auto";
  }
/*-------------------------------------- Display Card Details ----------------------------------*/
function displayCards(bills) {
    const container = document.getElementById('display_data');
    container.innerHTML = '';
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    bills.forEach(bill => {
        const card = document.createElement('div');
        card.className = 'card';
        const amount = parseFloat(bill.amount);

        card.innerHTML = `
            <div class="align_line"> 
                <h4>ID Number: ${bill.id}</h4> 
                <div>
                    <button onclick="delete_By_Id(${bill.id})">Delete</button>
                    <button onclick="update_By_Id(${bill.id})">Update</button>
                </div>
            </div>
            <p><span class="label">Bill Number: ${bill.bill_number}</p>
            <p><span class="label">Customer ID:</span> ${bill.customer_id}</p>
            <p><span class="label">Bill Date:</span> ${new Date(bill.bill_date).toLocaleDateString()}</p>
            <p><span class="label">Amount:</span> $${isNaN(amount) ? 'N/A' : amount.toFixed(2)}</p>
            <p><span class="label">Status:</span> ${bill.status}</p>
            <p><span class="label">Payment Due Date:</span> ${new Date(bill.payment_due_date).toLocaleDateString()}</p>
            <p><span class="label">Payment Method:</span> ${bill.payment_method}</p>
            <hr>
        `;
        container.appendChild(card);
        const row = document.createElement('tr');
        const amount1 = parseFloat(bill.amount).toFixed(2);

        row.innerHTML = `
            <td>${bill.id}</td>
            <td>${bill.bill_number}</td>
            <td>${bill.customer_id}</td>
            <td>${new Date(bill.bill_date).toLocaleDateString()}</td>
            <td>$${isNaN(amount1) ? 'N/A' : amount1}</td>
            <td>${bill.status}</td>
            <td>${new Date(bill.payment_due_date).toLocaleDateString()}</td>
            <td>${bill.payment_method}</td>
        `;
        tableBody.appendChild(row);
    });
}

/*----------------------------------- Delete Card Details By ID ---------------------------------*/
function delete_By_Id(id) {
    if (!confirm('Are you sure you want to delete this bill?')) {
        return;
    }

    fetch(`/api/bills/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Bill deleted successfully!');
            location.reload();
        } else {
            alert('Failed to delete the bill.');
        }
    })
    .catch(error => {
        console.error('Error deleting bill:', error);
        alert('Failed to delete the bill.');
    });
}
/*-------------------------------------- Logout User ---------------------------------------*/
function logout() {
    window.location.href = "/index.html";
}

/*-------------------------------------- Add Card Details ----------------------------------*/
document.getElementById('billForm').addEventListener('submit', function(event) {
    // showloader();
    event.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    if (!validateData(data)) {
        console.log('Invalid data');
        return;
    }
    fetch('/api/bills', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        alert('Bill added successfully!');
        this.reset();
        hideloader();
        location.reload;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add bill.');
        hideloader();
    });
});

/*-------------------------------------- Details Validation Function ----------------------------------*/
function validateData(data) {
    let isValid = true;

    clearErrors();

    if (!data.bill_number || data.bill_number.trim() === '') {
        isValid = false;
        showError('bill_number', 'Bill Number is required.');
    }

    if (!data.customer_id || isNaN(data.customer_id) || data.customer_id <= 0) {
        isValid = false;
        showError('customer_id', 'Customer ID must be a positive number.');
    }

    if (!data.bill_date) {
        isValid = false;
        showError('bill_date', 'Bill Date is required.');
    }

    if (!data.amount || isNaN(data.amount) || data.amount <= 0) {
        isValid = false;
        showError('amount', 'Amount must be a positive number.');
    }

    if (!data.payment_due_date) {
        isValid = false;
        showError('payment_due_date', 'Payment Due Date is required.');
    }

    const validPaymentMethods = ['Debit card', 'Credit card', 'Cash', 'UPI', 'Net banking', 'Bank Transfer'];
    if (!validPaymentMethods.includes(data.payment_method)) {
        isValid = false;
        showError('payment_method', 'Payment Method is invalid.');
    }

    const billDate = new Date(data.bill_date);
    const paymentDueDate = new Date(data.payment_due_date);
    if (paymentDueDate < billDate) {
        isValid = false;
        showError('payment_due_date', 'Payment Due Date cannot be earlier than Bill Date.');
    }

    return isValid;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentElement.appendChild(errorElement);
}
async function view_data(){
    try {
        if(confirm('Do You Want To Download Data')){
            const response = await fetch('/api/download', {
                method: 'GET',
            });

            if (!response.ok) {
                console.log(response);
                throw new Error('Failed to download file');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'bills.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
}
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
}

/*-------------------------------------- Show Table Function ----------------------------------*/
function view_Table(){
    document.getElementById('overshade1').style.display = 'block';
}

/*------------------------------------- Close Table view Function -------------------------------*/
function close_table(){
    document.getElementById('overshade1').style.display = 'none';
}
/*-------------------------------------- Search By Id Function ----------------------------------*/
function search_By_Id(){
    document.getElementById('overshade3').style.display = 'block';
    document.getElementById('billId').textContent = '';
}
function search(){
    try{
        let data = document.getElementById('billId').value;
        if(data == ''){
            alert('Please enter the bill number');
            return;
        }
        // for(let i = 0; i < billdata.length; i++){
        //     if(billdata[i].id == data){
        //         display_search(billdata[i]);
        //         return;
        //     }
        // }
        fetch(`/api/bills/${data}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(result => {
            if(result.id != undefined)
                display_search(result);
            else{
                const errorElement = document.createElement('span');
                errorElement.className = 'error-message';
                errorElement.textContent = 'Id not found';
                document.getElementById('search_result').appendChild(errorElement);
            }
        })
        .catch(error => {
            console.error('Id not found:', error);
        });
    }
    catch(e){
        console.log(e.message);
    }
}
function display_search(bill){
    let contnent=document.getElementById('search_result');
    contnent.innerHTML="";
    const card = document.createElement('div');
        card.className = 'card';
        const amount = parseFloat(bill.amount);

        card.innerHTML = `
            <div class="align_line"> 
                <h4>ID Number: ${bill.id}</h4> 
                <div>
                    <button onclick="delete_By_Id(${bill.id})">Delete</button>
                    <button onclick="update_By_Id(${bill.id})">Update</button>
                </div>
            </div>
            <p><span class="label">Bill Number: ${bill.bill_number}</p>
            <p><span class="label">Customer ID:</span> ${bill.customer_id}</p>
            <p><span class="label">Bill Date:</span> ${new Date(bill.bill_date).toLocaleDateString()}</p>
            <p><span class="label">Amount:</span> $${isNaN(amount) ? 'N/A' : amount.toFixed(2)}</p>
            <p><span class="label">Status:</span> ${bill.status}</p>
            <p><span class="label">Payment Due Date:</span> ${new Date(bill.payment_due_date).toLocaleDateString()}</p>
            <p><span class="label">Payment Method:</span> ${bill.payment_method}</p>
            <hr>
        `;
        contnent.appendChild(card);

}
function close_search(){
    document.getElementById('overshade3').style.display = 'none';
}

/*-------------------------------------- Update Bill Function ----------------------------------*/
document.getElementById('editForm').addEventListener('submit', function(event) {
    showloader();
    event.preventDefault();
    let data ={
        bill_number: document.getElementById('edit_bill_number').value,
        customer_id: document.getElementById('edit_customer_id').value,
        bill_date: document.getElementById('edit_bill_date').value,
        amount: document.getElementById('edit_amount').value,
        status: document.getElementById('edit_status').value,
        payment_due_date: document.getElementById('edit_payment_due_date').value,
        payment_method: document.getElementById('edit_payment_method').value
    };
    if (!validateData(data)) {
        console.log('Invalid data');
        return;
    }
    const id = document.getElementById('editId').value;
    // console.log('Edit ID:', id);
    fetch(`/api/bills/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json()})
    .then(result => {
        document.getElementById('overshade4').style.display = 'none';
        location.reload(); 
        hideloader();
    })
    .catch(error => {
        if (error.message.includes('422')) {
            alert('The bill number already exists.');
        } 
        else{
            console.error('Error updating bill:', error);
            alert('Failed to update bill.');
        }
        hideloader();
    });
});

function cancelEdit() {
    document.getElementById('overshade4').style.display = 'none';
    document.getElementById('overshade1').style.display = 'none';
}

function update_By_Id(id){
    document.getElementById('overshade4').style.display = 'block';
    document.getElementById('editId').value = id;
    const bill = billdata.find(b => b.id == id);
    const date1 = new Date(bill.bill_date);
    const year = date1.getFullYear();
    const month = String(date1.getMonth() + 1).padStart(2, '0'); 
    const day = String(date1.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const date2 = new Date(bill.payment_due_date);
    const year1 = date2.getFullYear();
    const month1 = String(date2.getMonth() + 1).padStart(2, '0'); 
    const day1 = String(date2.getDate()).padStart(2, '0');
    const formattedDate1 = `${year1}-${month1}-${day1}`;
    document.getElementById('edit_bill_number').value = bill.bill_number;
    document.getElementById('edit_customer_id').value = bill.customer_id;
    document.getElementById('edit_bill_date').value = formattedDate;
    document.getElementById('edit_amount').value = bill.amount;
    document.getElementById('edit_status').value = bill.status;
    document.getElementById('edit_payment_due_date').value = formattedDate1;
    document.getElementById('edit_payment_method').value = bill.payment_method;
}