
const group = JSON.parse(localStorage.getItem('receipt-group'));
const extras = JSON.parse(localStorage.getItem('extras'));
const code = JSON.parse(localStorage.getItem('code'));



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

  if(code==1){
    printRecipt();
  }
  else if(code==2){
    saveAsPDF();
  }
  else{
    alert("Error!!, Contact Developer");
  }

  


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


function saveAsPDF(){

  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');


  const fileName = `${group.groupName}_(${day}-${month}-${year}) (${hours}-${minutes}).pdf`;

  

  html2canvas(document.body).then(canvas => {
    
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');

      const imgData = canvas.toDataURL('image/png');

  
      const imgWidth = 210; 
      const pageHeight = 295; 
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;


      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
      }

      doc.save(fileName);


      window.location.assign('./home-page.html');
  });
}



function printRecipt(){
  window.print();

  setTimeout(() => {
    window.location.assign('./home-page.html');
  }, 3000);
  
}