const paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener("submit", payWithPaystack, false);
const success_error_modele = document.querySelector('.success_error_modele');
const transactions_UI = document.querySelector('.transactions');
let transactions_arr = [];
// localStorage.removeItem("paystack_transactions_api_raymond");

// get from local storage
function get_transactions() {
    let transactions;
    if (JSON.parse(localStorage.getItem("paystack_transactions_api_raymond")) === null) {
        transactions = [];
    } else {
        transactions = JSON.parse(localStorage.getItem("paystack_transactions_api_raymond"));
    }
    return transactions;
}
// add from local storage
function add_transactions(transaction) {
    const transactions = get_transactions();
    transactions.push(transaction);
    localStorage.setItem("paystack_transactions_api_raymond", JSON.stringify(transactions));
}
// update UI from LS
function update_UI() {
    transactions_UI.innerHTML = "";
    const transactions = get_transactions();
    transactions.forEach((transaction, i) => {
        console.log(`Email: ${transaction[i].email}, Amount: ${transaction[i].amount}, Payment Status: ${transaction[i].message}`);
        transactions_UI.innerHTML += `<div class="transactions_con">
            <p>Email: ${transaction[i].email}</p>
            <p>Amount: ${transaction[i].amount}</p>
            <p>Payment Status: ${transaction[i].message}</p> 
            </div>`;
    });
}
// paystack function
function payWithPaystack(e) {
    e.preventDefault();
    let email = document.getElementById("email-address").value;
    let amount = document.getElementById("amount").value * 100;

    let handler = PaystackPop.setup({
        key: 'pk_test_c3f86bec087df1cc38252b08b33f0343165f124a', // Replace with your public key
        email: document.getElementById("email-address").value,
        amount: document.getElementById("amount").value * 100,
        ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
        // label: "Optional string that replaces customer email"
        onClose: function () {
            success_error_modele.children[0].children[0].textContent = "Window closed.";
            success_error_modele.classList.add("active");
            setTimeout(function () {
                success_error_modele.classList.remove("active");
            }, 2000);
        },
        callback: function (response) {
            let message = 'Payment complete! Reference: ' + response.reference;
            success_error_modele.children[0].children[0].textContent = message;
            success_error_modele.classList.add("active");
            // store to localstorage
            const transaction = { email: email, amount: amount, message: message };
            const got_transactions = get_transactions();
            got_transactions.push(transaction);
            add_transactions(got_transactions);
            // make UI updates
            update_UI();
            setTimeout(function () {
                success_error_modele.classList.remove("active");
            }, 2000);
        }
    });

    handler.openIframe();
}
update_UI();//will be continued
