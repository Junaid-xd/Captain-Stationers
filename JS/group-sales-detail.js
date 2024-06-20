import { groups, returnGroupByID } from "./group.js";

const id = JSON.parse(localStorage.getItem('sale-groupID'));


const group = returnGroupByID(id);

setFinalCalculationInputsToInitialState();



function renderMainContent(){

  makeRemoveBookButtonInteractive();
  makeRemoveCopyButtonInteractive();
  makePrintButtonInteractive();
  

  let Total = doTotal();


  document.querySelector('.sales-group-name').innerHTML = `<b>${group.groupName} </b>`;

  let tableHead = document.querySelector('.sales-detail-table-head');
  let tableBody = document.querySelector('.sales-detail-table-body');



  tableHead.innerHTML=`
    <th>SR#</th>
    <th>NAME</th>
    <th>PUB</th>
    <th>QUANTITY</th>
    <th>PRICE</th>
    <th>#</th>
  `;


  let counter = 1;
  tableBody.innerHTML="";
  group.books.forEach((book)=>{
    tableBody.innerHTML += `
    <tr class="admin-popup-table-row">
      <td>${counter}</td>
      <td class="sales-detail-table-name-section">${book.bookName}</td>
      <td class="admin-home-popup-table-publisher">${book.publication}</td>
      <td ><input type="number" value="${book.quantity || 0}" class="sales-table-quantity-input"></td>
      <td><input type="number" value="${book.price || 0}" class="sales-table-price-input"></td>
      <td><button class="sales-remove-btn" data-remove-group-bookID="${book.bookID}">Remove</button></td>
    </tr>
    `;
    counter++;
  });


  makeRemoveButtonInteractive(group);
  
  makeThingsEditable();


  
  makeFinalCalculationFunctional();
  
  
  
  evaluateBalance(Total);

  Total = evaluateDiscount(Total);


  renderTotal(Total);
  
}

renderMainContent();



function doTotal(){

  let sum = 0;  
  group.books.forEach((book)=>{
    sum += book.quantity * book.price;
  });
  // renderTotal(sum);
  return sum;
}

function renderTotal(Total){
  document.querySelector('.sales-total-price').innerHTML = `
    <b>Total : <span> ${Total} \\-</span></b>
  `;
}


function makeRemoveButtonInteractive(group){

  document.querySelectorAll('.sales-remove-btn').forEach(()=>{

    document.querySelectorAll('.sales-remove-btn').forEach((button) => {
      button.addEventListener('click', function() {
        const targetBookID = this.getAttribute("data-remove-group-bookID");
        group.books = group.books.filter(book => book.bookID != targetBookID);
        renderMainContent();
      });
    });
  });
  
}


function makeThingsEditable(){
  document.querySelectorAll('.sales-table-quantity-input').forEach(()=>{

    document.querySelectorAll('.sales-table-quantity-input').forEach((input) => {
      input.addEventListener('change', ()=>{
        saveChangesToGroup();
        renderMainContent();
      });
    });
  });



  document.querySelectorAll('.sales-table-price-input').forEach(()=>{

    document.querySelectorAll('.sales-table-price-input').forEach((input) => {
      input.addEventListener('change', ()=>{
        saveChangesToGroup();
        renderMainContent();
      });
    });
  });


}

function saveChangesToGroup(){
  let table = document.querySelector('.sales-detail-table');
  for (var i = 1, row; row = table.rows[i]; i++)
  {

    const quantityInput = table.rows[i].querySelector('.sales-table-quantity-input');
    const priceInput = table.rows[i].querySelector('.sales-table-price-input');

    
    let quantity = parseInt(quantityInput.value) || 0;
    let price = parseFloat(priceInput.value) || 0;
    
    group.books[i-1].quantity = quantity;
    group.books[i-1].price = price;
    

  }

  //console.log(group);
  //doTotal();
}


function setFinalCalculationInputsToInitialState(){
  document.querySelector('.sales-discount-input').value = 0;
  document.querySelector('.sales-cash-input').value = 0;
}


function makeFinalCalculationFunctional(){

  document.querySelector('.sales-discount-input').addEventListener('change',()=>{
    renderMainContent();
  });

  document.querySelector('.sales-discount-input').addEventListener('click',()=>{
    document.querySelector('.sales-discount-input').value = "";
  });
  
  document.querySelector('.sales-cash-input').addEventListener('change',()=>{
    renderMainContent();
  });

  document.querySelector('.sales-cash-input').addEventListener('click',()=>{
    document.querySelector('.sales-cash-input').value = "";
  });


}

function evaluateDiscount(total){
  const discount = document.querySelector('.sales-discount-input').value;

  const finalTotal = total - discount;

  evaluateBalance(finalTotal);

  return finalTotal;
}


function evaluateBalance(total){
  let balance = 0;
  const cash = document.querySelector('.sales-cash-input').value;

  balance = cash - total;

  document.querySelector('.sales-balance-input').value = balance

  
}


function makeRemoveBookButtonInteractive(){
  
  document.querySelector('.sales-remove-book-btn').addEventListener('click', () => {
    
    groups.forEach(group => {
        group.books = group.books.filter(book => book.type !== 'book');
    });

    renderMainContent();

  });

}


function makeRemoveCopyButtonInteractive(){
  
  document.querySelector('.sales-remove-copies-btn').addEventListener('click', () => {
    
    groups.forEach(group => {
        group.books = group.books.filter(book => book.type !== 'copy');
    });

    renderMainContent();
    
  });

}


function makePrintButtonInteractive(){
  document.querySelector('.sales-print-btn').addEventListener('click', ()=>{


    localStorage.setItem('receipt-group', JSON.stringify(group));

    const extras = {
      discount: document.querySelector('.sales-discount-input').value,
      cash: document.querySelector('.sales-cash-input').value,
      balance: document.querySelector('.sales-balance-input').value
    }

    localStorage.setItem('extras', JSON.stringify(extras));

    window.location.assign('./sales-receipt.html');
  });
}