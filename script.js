// DOM Elements
const expenseForm = document.getElementById('expenseForm');
const amountInput = document.getElementById('amountInput');
const categoryInput = document.getElementById('categoryInput');
const accountInput = document.getElementById('accountInput');
const saveButton = document.getElementById('saveButton');
const exportButton = document.getElementById('exportButton');

// Retrieve existing expenses from localStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Add Expense
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value.trim();
    const account = accountInput.value.trim();
    const date = new Date().toLocaleString();

    // Validate Inputs
    if (!isValidAmount(amount)) {
        showError(amountInput, 'Please enter a valid amount!');
        return;
    }

    if (!category) {
        showError(categoryInput, 'Please select a category!');
        return;
    }

    if (!account) {
        showError(accountInput, 'Please select an account!');
        return;
    }

    // Create Expense Object
    const expense = {
        id: crypto.randomUUID(),
        amount,
        category,
        account,
        date,
    };

    // Add Expense to List
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Clear Inputs
    clearInputs();
    alert('Expense added successfully!');
    renderTransactions(); // Re-render the transaction list to reflect the new expense
});

// Show Inline Error
function showError(input, message) {
    const errorMessage = input.nextElementSibling;
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    input.classList.add('error');

    setTimeout(() => {
        errorMessage.classList.add('hidden');
        input.classList.remove('error');
    }, 3000);
}

// Validate Amount
function isValidAmount(amount) {
    return !isNaN(amount) && amount > 0;
}

// Clear Input Fields
function clearInputs() {
    amountInput.value = '';
    categoryInput.value = '';
    accountInput.value = '';
}

// Save Expenses
saveButton.addEventListener('click', () => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    alert('Expenses saved to local storage!');
});

// Export Expenses
exportButton.addEventListener('click', () => {
    const data = JSON.stringify(expenses, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.json';
    a.click();

    URL.revokeObjectURL(url); // Clean up URL object
    alert('Expenses exported successfully!');
});

// Function to render latest transactions
function renderTransactions() {
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = ''; // Clear previous transactions

    expenses.slice(-5).reverse().forEach(exp => {
        const transactionItem = document.createElement('div');
        transactionItem.classList.add('transaction');

        // Category Icon
        const categoryIcon = document.createElement('div');
        categoryIcon.classList.add('category-icon');
        const icon = getCategoryIcon(exp.category);

        categoryIcon.textContent = icon; // Set the text content to the icon emoji

        // Transaction Details
        const transactionDetails = document.createElement('div');
        transactionDetails.classList.add('transaction-details');
        transactionDetails.innerHTML = `
            <strong>${exp.category}</strong>
            <span>${exp.account}</span>
            <span class="date">${exp.date}</span>
        `;

        // Transaction Amount
        const transactionAmount = document.createElement('div');
        transactionAmount.classList.add('amount');
        transactionAmount.textContent = `$${exp.amount.toFixed(2)}`;

        // Append Elements
        transactionItem.appendChild(categoryIcon);
        transactionItem.appendChild(transactionDetails);
        transactionItem.appendChild(transactionAmount);
        transactionList.appendChild(transactionItem);
    });
}

// Render transactions on page load
window.onload = function () {
    renderTransactions();
};

// Function to get category icon
function getCategoryIcon(category) {
    const icons = {
        Food: '🍔',
        Transport: '🚗',
        Utilities: '💡',
        Entertainment: '🎮',
        Others: '🔖',
    };

    return icons[category] || '📌'; // Default to 📌 if category doesn't match
}
