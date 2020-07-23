window.alert(
  "Welcome back my lovely friends. Yippe, now your data will be saved and can be retrieved every time you visit the page."
);
// *****SET VARIABLES*****
const budgetEnter = $(".budgetEnter");
const budgetSubmit = $(".budgetSubmit");

let budgetAmount = $("#budgetAmount");
let expenseAmount = $("#expenseAmount");
let balanceAmount = $("#balanceAmount");

const expenseList = $(".expenseList");
const expenseTitleEnter = $(".expenseTitleEnter");
const expenseAmountEnter = $(".expenseAmountEnter");
let expenseSubmit = $(".expenseSubmit");

let element;
let editExpenseTitle;
let editExpenseAmount;
let editFlag = false;

//Adding text color to expense amount
expenseAmount.css("color", "red");

// *****EVENT LISTNERS*****
budgetSubmit.click(addBudget);
expenseSubmit.click(addExpense);

// *****FUNCTIONS*****
//Adding budget and balance
function addBudget(event) {
  event.preventDefault();

  const value = budgetEnter.val();
  let budget = budgetAmount.html();
  let balance = balanceAmount.html();

  if (value > 0) {
    //Enter
    //Entering budget amount
    budget += `+ ${value}`;
    budgetAmount.html(eval(budget));

    //Entering balance amount
    balance += `+ ${value}`;
    balanceAmount.html(eval(balance));

    displayAlert("alert1", "Budget Entered", "success");

    //Add Amount to Local Storage
    addAmountToLocalStorage("budget", eval(budget));
    addAmountToLocalStorage("balance", eval(balance));
  } else displayAlert("alert1", "Invalid Input", "warning"); //Empty Value

  //Set back to default
  setBackToDefault();
}

//Adding expenses
function addExpense(event) {
  event.preventDefault();

  const value1 = expenseTitleEnter.val();
  const value2 = expenseAmountEnter.val();

  if (value1 !== "" && value2 > 0) {
    const key = new Date().getTime().toString();
    if (editFlag === false) {
      //Enter
      expenseList.append(`
                <div id=${key} class="row eachExpense">
                    <div class="col-5">${value1}</div>
                    <div class="col-4 text-center">${value2}</div>
                    <div class="col-3 icon2">
                        <i id="edit" class="fas fa-edit float-left"></i>
                        <i id="remove" class="fas fa-trash float-right"></i>
                    </div>
                </div>
            `);

      $(".eachExpense #edit").click(editExpense);
      $(".eachExpense #remove").click(removeExpense);

      displayAlert("alert2", "Expense Added", "danger");
      change("add", value2);

      // Add to local storage
      addToLocalStorage(
        key,
        JSON.stringify({
          title: value1,
          amount: value2,
        })
      );
    } else if (editFlag === true) {
      //Edit
      element.css("visibility", "visible");
      editExpenseTitle.textContent = value1;
      editExpenseAmount.textContent = value2;

      change("add", value2);
      displayAlert("alert2", "Expense Edited", "danger");

      let x = element[0].id; //key
      //console.log(x);
      //Edit Local Storage
      addToLocalStorage(
        x,
        JSON.stringify({
          title: value1,
          amount: value2,
        })
      );
    }
    setBackToDefault();
  } else displayAlert("alert2", "Invalid Input", "warning"); //Empty Value
}

//set back to default only for expense list
function setBackToDefault() {
  $("input").val("");
  editFlag = false;
  expenseSubmit.html("Add Expense");
  $(".icon2").css("visibility", "visible");
}

//displaying alert
function displayAlert(alert, text, bg) {
  //Add Class
  $(`.${alert}`).html(text);
  $(`.${alert}`).addClass(`bg-${bg}`);

  //Remove Class after displaying ALERT
  setTimeout(function () {
    $(`.${alert}`).html("");
    $(`.${alert}`).removeClass(`bg-${bg}`);
  }, 1500);
}

//Editing an expense
function editExpense(event) {
  element = $(this).parent().parent();
  editExpenseTitle = element[0].children[0];
  editExpenseAmount = element[0].children[1];
  //console.log(element[0]);

  expenseTitleEnter.val(editExpenseTitle.textContent);
  expenseAmountEnter.val(editExpenseAmount.textContent);

  element.css("visibility", "hidden");
  $(".icon2").css("visibility", "hidden");

  editFlag = true;
  expenseSubmit.html("Edit Expense");

  //Amount has to be refunded untill edited
  change("refund", editExpenseAmount.textContent);
  event.stopImmediatePropagation();
}

//Removing an expense
function removeExpense(event) {
  const element = $(this).parent().parent();
  //console.log(element);
  let key = element[0].id;
  //Remove from Local Storage
  removeFromLocalStorage(key);

  //Add the expense and balance amount from removed espense
  const refundAmount = element[0].children[1].textContent;
  //console.log(refundAmount);
  change("refund", refundAmount);

  //remove the expense content
  element.fadeOut(500, function () {
    $(this).remove();
  });
  event.stopImmediatePropagation();

  displayAlert("alert2", "Expense Removed", "success");
}

//Changes to expense and balance amount only from expense entry
function change(type, value) {
  /*
        - type = means removal(refund) or adding(add)
        - value = amount to be refunded or added
        - "add" type will come from adding an expense whereas
           "refund" type will come in case of editing or removing an expense
    */
  let expense = expenseAmount.html();
  let balance = balanceAmount.html();

  if (type === "add") {
    //here we need to add amount to expense and remove from balance
    expense += `+ ${value}`;
    balance += `- ${value}`;
  } //obviously the other type is "refund"
  else {
    //here we need to add amount to balance and remove from expense
    expense += `- ${value}`;
    balance += `+ ${value}`;
  }
  //Final changes to expense and balance amount
  expenseAmount.html(eval(expense));
  balanceAmount.html(eval(balance));

  //Add Amount to Local Storage
  addAmountToLocalStorage("expense", eval(expense));
  addAmountToLocalStorage("balance", eval(balance));
}

// *****LOCAL STORAGE*****
function addAmountToLocalStorage(type, value) {
  //Only for adding and editing amount
  /*
        type = budget or expense or balance 
        value = amount
    */

  let changes = JSON.parse(localStorage.getItem("amount"));
  changes[type] = value;
  //console.log(changes);
  localStorage.setItem("amount", JSON.stringify(changes));
  //text color changes to balance
  if (balanceAmount.html() < 0) {
    balanceAmount.css("color", "red");
  } else {
    balanceAmount.css("color", "green");
  }
}

function addToLocalStorage(key, value) {
  //Only for adding and editing expense list
  localStorage.setItem(key, value);
}

function removeFromLocalStorage(key) {
  //Only for expense list
  localStorage.removeItem(key);
}

// *****SETUP ITEMS*****
window.onload = function () {
  setBackToDefault();

  if (localStorage.length === 1) {
    // console.log("empty Storage");

    //Initial setting of local storage of budget,expense and balance amount
    localStorage.setItem(
      "amount",
      JSON.stringify({
        budget: 0,
        expense: 0,
        balance: 0,
      })
    );
    //Initial setup of budget,expense and balance amount
    budgetAmount.html(JSON.parse(localStorage.getItem("amount")).budget);
    expenseAmount.html(JSON.parse(localStorage.getItem("amount")).expense);
    balanceAmount.html(JSON.parse(localStorage.getItem("amount")).balance);
  } else {
    // console.log("Not an empty storage");

    //Setting up the amounts
    budgetAmount.html(JSON.parse(localStorage.getItem("amount")).budget);
    expenseAmount.html(JSON.parse(localStorage.getItem("amount")).expense);
    balanceAmount.html(JSON.parse(localStorage.getItem("amount")).balance);

    //ordering the key values of local storage
    var keys = [];
    for (let j = 0; j < localStorage.length; j++) {
      if (localStorage.key(j) !== "amount") {
        keys.push(localStorage.key(j));
      }
    }
    keys.sort((a, b) => a - b);
    // console.log(keys);

    //Setting up expenses
    for (let i = 0; i < localStorage.length - 1; i++) {
      expenseList.append(`
                <div id=${keys[i]} class="row eachExpense">
                    <div class="col-5">${
                      JSON.parse(localStorage.getItem(keys[i])).title
                    }</div>
                    <div class="col-4 text-center">${
                      JSON.parse(localStorage.getItem(keys[i])).amount
                    }</div>
                    <div class="col-3 icon2">
                        <i id="edit" class="fas fa-edit float-left"></i>
                        <i id="remove" class="fas fa-trash float-right"></i>
                    </div>
                </div>
            `);

      $(".eachExpense #edit").click(editExpense);
      $(".eachExpense #remove").click(removeExpense);
    }
    
    //text color changes to balance
    if (balanceAmount.html() < 0) {
      balanceAmount.css("color", "red");
    } else {
      balanceAmount.css("color", "green");
    }

    displayAlert("alert1", "Data Loaded Successfully", "info");
  }
};
