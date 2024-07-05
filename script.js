// Seleccionamos los elementos del DOM
const mainMenu = document.getElementById('main-menu');
const budgetCreation = document.getElementById('budget-creation');
const budgetList = document.getElementById('budget-list');
const transactionWindow = document.getElementById('transaction-window');
const budgetTitle = document.getElementById('budget-title');
const createBudgetBtn = document.getElementById('create-budget-btn');
const existingBudgetsBtn = document.getElementById('existing-budgets-btn');
const backToMainMenu = document.getElementById('back-to-main-menu');
const backToMainMenuFromList = document.getElementById('back-to-main-menu-from-list');
const backToBudgetsBtn = document.getElementById('back-to-budgets'); // Nuevo botón para regresar a presupuestos
const newBudgetForm = document.getElementById('new-budget-form');
const budgetNameInput = document.getElementById('budget-name');
const budgetsList = document.getElementById('budgets-list');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');

// Inicializamos el balance, ingresos y gastos
let balance = 0;
let income = 0;
let expense = 0;

// Cargamos los presupuestos desde localStorage
let budgets = JSON.parse(localStorage.getItem('budgets')) || [];
let currentBudget = null;

// Función para mostrar una ventana
function showWindow(window) {
    mainMenu.style.display = 'none';
    budgetCreation.style.display = 'none';
    budgetList.style.display = 'none';
    transactionWindow.style.display = 'none';
    window.style.display = 'block';
}

// Función para actualizar el DOM
function updateDOM() {
    balanceEl.textContent = balance.toFixed(2);
    incomeEl.textContent = income.toFixed(2);
    expenseEl.textContent = expense.toFixed(2);
}

// Función para agregar una transacción al DOM y a localStorage
function addTransaction(e) {
    e.preventDefault();
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const type = typeSelect.value;

    if (type === "") {
        alert('Por favor seleccione si es ingreso o gasto');
        return;
    }

    if (isNaN(amount) || amount === 0) {
        alert('Por favor ingrese un monto válido');
        return;
    }

    const transaction = {
        id: generateID(),
        description,
        amount,
        type
    };

    currentBudget.transactions.unshift(transaction); // Añadir al principio del array
    addTransactionDOM(transaction);
    updateValues();

    localStorage.setItem('budgets', JSON.stringify(budgets));

    descriptionInput.value = '';
    amountInput.value = '';
    typeSelect.value = ''; // Reinicia el select después de agregar la transacción
}

// Función para generar un ID único
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}

// Función para agregar una transacción al DOM
function addTransactionDOM(transaction) {
    const sign = transaction.type === 'income' ? '+' : '-';
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        ${transaction.description} <span>${sign}${transaction.amount.toFixed(2)}</span>
        <button class="delete-btn" onclick="confirmRemoveTransaction(${transaction.id})">X</button>
    `;
    transactionList.prepend(listItem); // Añadir al principio de la lista
}

// Función para actualizar los valores de balance, ingresos y gastos
function updateValues() {
    balance = currentBudget.transactions.reduce((acc, transaction) => 
        transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount, 0);

    income = currentBudget.transactions.filter(transaction => transaction.type === 'income')
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    expense = currentBudget.transactions.filter(transaction => transaction.type === 'expense')
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    updateDOM();
}

// Función para eliminar una transacción
function removeTransaction(id) {
    currentBudget.transactions = currentBudget.transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem('budgets', JSON.stringify(budgets));
    initTransactions();
}

// Función para confirmar la eliminación de una transacción
function confirmRemoveTransaction(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta transacción?')) {
        removeTransaction(id);
    }
}

// Función para inicializar la lista de transacciones
function initTransactions() {
    transactionList.innerHTML = '';
    if (currentBudget && currentBudget.transactions) {
        currentBudget.transactions.forEach(addTransactionDOM);
        updateValues();
    }
}

// Función para crear un nuevo presupuesto
function createNewBudget(e) {
    e.preventDefault();
    const budgetName = budgetNameInput.value;
    const budget = {
        id: generateID(),
        name: budgetName,
        transactions: []
    };
    budgets.push(budget);
    localStorage.setItem('budgets', JSON.stringify(budgets));
    budgetNameInput.value = '';
    loadBudgets();
    showWindow(transactionWindow);
    currentBudget = budget;
    budgetTitle.textContent = budgetName;
    initTransactions();
}

// Función para cargar los presupuestos existentes
function loadBudgets() {
    budgetsList.innerHTML = '';
    budgets.forEach((budget, index) => {
        const li = document.createElement('li');
        li.textContent = budget.name;

        // Botón para eliminar presupuesto
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.classList.add('delete-budget-btn');
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Detener la propagación para evitar que active el evento del li
            confirmRemoveBudget(budget.id); // Confirmar eliminación
        });

        // Event listener para seleccionar un presupuesto existente
        li.addEventListener('click', () => {
            currentBudget = budget;
            budgetTitle.textContent = budget.name;
            showWindow(transactionWindow);
            initTransactions();
        });

        li.appendChild(deleteBtn);
        budgetsList.appendChild(li);
    });
}

// Función para confirmar la eliminación de un presupuesto
function confirmRemoveBudget(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este presupuesto?')) {
        removeBudget(id);
    }
}

// Función para eliminar un presupuesto
function removeBudget(id) {
    budgets = budgets.filter(budget => budget.id !== id);
    localStorage.setItem('budgets', JSON.stringify(budgets));
    loadBudgets();
}

// Event Listeners
createBudgetBtn.addEventListener('click', () => showWindow(budgetCreation));
existingBudgetsBtn.addEventListener('click', () => {
    loadBudgets();
    showWindow(budgetList);
});
backToMainMenu.addEventListener('click', () => showWindow(mainMenu));
backToMainMenuFromList.addEventListener('click', () => showWindow(mainMenu));
backToBudgetsBtn.addEventListener('click', () => showWindow(budgetList)); // Ajuste para regresar a presupuestos
newBudgetForm.addEventListener('submit', createNewBudget);
transactionForm.addEventListener('submit', addTransaction);

// Inicialización
showWindow(mainMenu);
