
const group = JSON.parse(localStorage.getItem('receipt-group'));
const extras = JSON.parse(localStorage.getItem('extras'));

// console.log(group);
// console.log(extras);

function renderMainContent(){


  document.querySelector('.receipt-group-name-div').innerHTML = `<b>${group.groupName} </b>`;

  let tableHead = document.querySelector('.receipt-detail-table-head');
  let tableBody = document.querySelector('.receipt-detail-table-body');

  tableHead.innerHTML=`
    <th>SR#</th>
    <th>NAME</th>
    <th>PUB</th>
    <th>QUANTITY</th>
    <th>PRICE</th>
  `;


  let counter = 1;
  tableBody.innerHTML="";
  group.books.forEach((book)=>{
    tableBody.innerHTML += `
    <tr class="admin-popup-table-row">
      <td>${counter}</td>
      <td class="receipt-detail-table-name-section">${book.bookName}</td>
      <td>${book.publication}</td>
      <td >${book.quantity}</td>
      <td>${book.price}</td>
    </tr>
    `;
    counter++;
  });

  doCalculation();

  window.print();

  

}

renderMainContent();


function doCalculation(){
  let total = document.querySelector('.receipt-total-output');
  let discount = document.querySelector('.receipt-discount-output');
  let cash = document.querySelector('.receipt-cash-output');
  let balance = document.querySelector('.receipt-balance-output');
  let finalTotal = document.querySelector('.receipt-Final-total');

  discount.innerHTML = parseInt(extras.discount);
  cash.innerHTML = parseInt(extras.cash);
  balance.innerHTML = parseInt(extras.balance);

  const grossTotal = parseInt(extras.cash - extras.balance);

  
  total.innerHTML = grossTotal + parseInt(extras.discount);

  finalTotal.innerHTML  = `Received: <span>${parseInt(grossTotal)} \\- </span>` ;

}