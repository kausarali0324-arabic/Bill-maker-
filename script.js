// Default Date set to today
document.getElementById('invDate').valueAsDate = new Date();

// DOM Elements
const bizNameInput = document.getElementById('bizName');
const bizPhoneInput = document.getElementById('bizPhone');
const bizAddressInput = document.getElementById('bizAddress');
const custNameInput = document.getElementById('custName');
const custPhoneInput = document.getElementById('custPhone');
const custAddressInput = document.getElementById('custAddress');
const invNumberInput = document.getElementById('invNumber');
const invDateInput = document.getElementById('invDate');
const discountInput = document.getElementById('discountRate');
const taxInput = document.getElementById('taxRate');

// Preview Elements
const prevBizName = document.getElementById('prevBizName');
const prevBizContact = document.getElementById('prevBizContact');
const prevCustName = document.getElementById('prevCustName');
const prevCustPhone = document.getElementById('prevCustPhone');
const prevCustAddress = document.getElementById('prevCustAddress');
const prevInvNum = document.getElementById('prevInvNum');
const prevDate = document.getElementById('prevDate');

const itemsList = document.getElementById('itemsList');
const prevItemsList = document.getElementById('prevItemsList');
const addItemBtn = document.getElementById('addItemBtn');

// Items Array
let items = [
    { name: 'Product A', qty: 2, price: 500 },
    { name: 'Product B', qty: 1, price: 800 }
];

// Initialize UI
function init() {
    updateHeaderPreview();
    renderItems();
    
    // Listeners for live updates
    [bizNameInput, bizPhoneInput, bizAddressInput, custNameInput, custPhoneInput, custAddressInput, invNumberInput, invDateInput, discountInput, taxInput].forEach(element => {
        element.addEventListener('input', updateAll);
    });
}

function updateHeaderPreview() {
    prevBizName.innerText = bizNameInput.value || 'My Business';
    prevBizContact.innerText = `Phone: ${bizPhoneInput.value || '---'} | Address: ${bizAddressInput.value || '---'}`;
    prevCustName.innerText = custNameInput.value || 'Customer Name';
    prevCustPhone.innerText = custPhoneInput.value || '---';
    prevCustAddress.innerText = custAddressInput.value || '---';
    prevInvNum.innerText = invNumberInput.value || 'INV-001';
    prevDate.innerText = invDateInput.value || '--/--/----';
}

function renderItems() {
    itemsList.innerHTML = '';
    prevItemsList.innerHTML = '';

    let subtotal = 0;

    items.forEach((item, index) => {
        let itemTotal = item.qty * item.price;
        subtotal += itemTotal;

        // Render Editable Table Row in Form
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" value="${item.name}" oninput="updateItem(${index}, 'name', this.value)"></td>
            <td><input type="number" value="${item.qty}" min="1" style="width: 50px;" oninput="updateItem(${index}, 'qty', this.value)"></td>
            <td><input type="number" value="${item.price}" min="0" style="width: 70px;" oninput="updateItem(${index}, 'price', this.value)"></td>
            <td>${itemTotal.toLocaleString()}</td>
            <td><button class="btn-sm" style="background:#dc2626;" onclick="deleteItem(${index})">🗑️</button></td>
        `;
        itemsList.appendChild(tr);

        // Render Preview Table Row
        let prevTr = document.createElement('tr');
        prevTr.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name || 'Item'}</td>
            <td>${item.qty}</td>
            <td>${Number(item.price).toLocaleString()}</td>
            <td>${itemTotal.toLocaleString()}</td>
        `;
        prevItemsList.appendChild(prevTr);
    });

    calculateTotals(subtotal);
}

function calculateTotals(subtotal) {
    let discountPercent = parseFloat(discountInput.value) || 0;
    let taxPercent = parseFloat(taxInput.value) || 0;

    let discountAmount = (subtotal * discountPercent) / 100;
    let taxableAmount = subtotal - discountAmount;
    let taxAmount = (taxableAmount * taxPercent) / 100;
    let grandTotal = taxableAmount + taxAmount;

    // Update Preview text
    document.getElementById('prevSubtotal').innerText = subtotal.toLocaleString();
    document.getElementById('prevDiscount').innerText = `- ${discountAmount.toLocaleString()} (${discountPercent}%)`;
    document.getElementById('prevTax').innerText = `+ ${taxAmount.toLocaleString()} (${taxPercent}%)`;
    document.getElementById('prevGrandTotal').innerText = grandTotal.toLocaleString();
}

// Add New Item
addItemBtn.addEventListener('click', () => {
    items.push({ name: 'New Item', qty: 1, price: 100 });
    renderItems();
});

// Update Item Data
window.updateItem = function(index, field, value) {
    if(field === 'qty' || field === 'price') {
        items[index][field] = Number(value);
    } else {
        items[index][field] = value;
    }
    renderItems();
}

// Delete Item
window.deleteItem = function(index) {
    items.splice(index, 1);
    renderItems();
}

function updateAll() {
    updateHeaderPreview();
    renderItems();
}

// Print Handler
document.getElementById('printBtn').addEventListener('click', () => {
    window.print();
});

// Save to LocalStorage Handler
document.getElementById('saveBtn').addEventListener('click', () => {
    const invoiceData = {
        bizName: bizNameInput.value,
        bizPhone: bizPhoneInput.value,
        bizAddress: bizAddressInput.value,
        custName: custNameInput.value,
        custPhone: custPhoneInput.value,
        custAddress: custAddressInput.value,
        invNumber: invNumberInput.value,
        invDate: invDateInput.value,
        items: items,
        discount: discountInput.value,
        tax: taxInput.value
    };
    localStorage.setItem('savedInvoice', JSON.stringify(invoiceData));
    alert('Invoice saved successfully to LocalStorage!');
});

// Run Init
init();
