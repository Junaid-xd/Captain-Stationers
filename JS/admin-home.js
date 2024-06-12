import { useDefaultData } from './group.js';

document.querySelector('.default-data-btn').addEventListener('click',()=>{
  useDefaultData();
  location.reload();
});




import { groups } from './group.js';
import { removeBookTemporary } from './group.js';
import { returnNameByID } from './group.js';
import { deleteGroupByID } from './group.js';
import { updateGroupBooks } from './group.js';
import { addBookTemporary } from './group.js';



function renderGroups(){

  let content = document.querySelector('.admin-flex-box');
  content.innerHTML="";

  groups.forEach((group)=>{

    content.innerHTML+=`
      <div class="group-wrapper">
        <div class="boundary">
          <div class="admin-name-sec">${group.groupName}</div>
    
          <div class="admin-btn-sec">
            <button class="js-admin-delete-btn" data-delete-groupID="${group.groupID}">DELETE</button>
            <button class="js-admin-edit-btn" data-delete-groupID="${group.groupID}">EDIT</button>
          </div>
        </div>
      </div>
    `
  });

  interactiveDeleteandEditButton();
  makePopupHide();
}

renderGroups();





function interactiveDeleteandEditButton()
{
  document.querySelectorAll('.js-admin-edit-btn').forEach((button)=>{
    button.addEventListener('click', ()=>{
      const targetID = button.getAttribute("data-delete-groupID");
      renderPopupTableContent(targetID);
    })
  });


  document.querySelectorAll('.js-admin-delete-btn').forEach((button)=>{
    button.addEventListener('click', ()=>{
      const targetID = button.getAttribute("data-delete-groupID");
    
      document.getElementById("admin-home-delete-popup").classList.remove("hide-admin-delete-popup");

      let popupData = document.querySelector('.admin-delete-popup-content');
      popupData.innerHTML = '';
      const name = returnNameByID(targetID);
      popupData.innerHTML = `Delete group "<b>${name}</b>" ?`;
      localStorage.setItem('toBeDeleted',JSON.stringify(targetID))
    })
  });

}

function makePopupHide()
{
  document.querySelector('.admin-popup-close-btn').addEventListener('click', ()=>{
    document.getElementById("admin-home-popup").classList.add("hide-admin-popup");
    location.reload();
  });

  document.querySelector('.admin-delete-popup-cancel-btn').addEventListener('click', ()=>{
    document.getElementById("admin-home-delete-popup").classList.add("hide-admin-delete-popup");
  });

  document.querySelector('.admin-addBook-popup-cancel-btn').addEventListener('click', ()=>{
    document.getElementById("admin-home-addBook-popup").classList.add("hide-admin-addBook-popup");
  });
}


function finalPopupDeleteButton(){

  document.querySelector('.admin-delete-popup-delete-btn').addEventListener('click',()=>{
    const target = JSON.parse(localStorage.getItem('toBeDeleted'));
    deleteGroupByID(target);
    document.getElementById("admin-home-delete-popup").classList.add("hide-admin-delete-popup");
    renderGroups();
  });
}

finalPopupDeleteButton();

function openAdminPopup() {
  document.getElementById("admin-home-popup").classList.remove("hide-admin-popup");
}




function renderPopupTableContent(targetID)
{
  openAdminPopup();
  localStorage.setItem('key', targetID);
  let saveBtn = document.querySelector('.admin-popup-save-btn');
  let grpName = document.querySelector('.admin-home-popup-name-para');
  grpName.innerHTML = `<b>${returnNameByID(targetID)}</b>`;

  let tableHead = document.querySelector('.admin-popup-table-head');

  tableHead.innerHTML=`
    <th>SR#</th>
    <th>NAME</th>
    <th>PUB</th>
    <th>QUANTITY</th>
    <th>PRICE</th>
    <th>#</th>
  `;

  let tableBody = document.querySelector('.admin-popup-table-body');
  let counter = 1;
  tableBody.innerHTML="";
  groups.forEach((group)=>{
    if(group.groupID==targetID)
    {
      group.books.forEach((book)=>{
        tableBody.innerHTML += `
        <tr class="admin-popup-table-row">
          <td>${counter}</td>
          <td contenteditable="true" class="admin-home-name-col">${book.bookName}</td>
          <td class="admin-home-popup-table-publisher" contenteditable="true">${book.publication}</td>
          <td contenteditable="true">${book.quantity}</td>
          <td contenteditable="true">${book.price}</td>
          <td><button class="admin-home-remove-btn" data-remove-bookID="${book.bookID}">Remove</button></td>
        </tr>
        `;
        counter++;
        });
        
        saveBtn.setAttribute('data-saveChanges', group.groupID);
    }
  });
  makeRemoveButtonInteractive(targetID);
  makeSaveButtonInteractive();
  makeAddBookPopupReady();
}





function makeRemoveButtonInteractive(grpID)
{
  document.querySelectorAll('.admin-home-remove-btn').forEach((button)=>{
    button.addEventListener('click', ()=>{
      const idd = button.getAttribute("data-remove-bookID");
      removeBookTemporary(grpID, idd);
      renderPopupTableContent(grpID);
    });
  });
}


function makeSaveButtonInteractive(){
  let tempBooks = [];
  document.querySelector('.admin-popup-save-btn').addEventListener('click',()=>{

    const saveButton = document.querySelector('.admin-popup-save-btn');
    const targetID = saveButton.getAttribute("data-saveChanges");
    

    let tab = document.querySelector('.admin-home-table');

    for (var i = 1, row; row = tab.rows[i]; i++)
    {
      const book = {
        bookID: i,
        bookName: row.cells[1].innerHTML,
        publication: row.cells[2].innerHTML,
        quantity: row.cells[3].innerHTML,
        price: row.cells[4].innerHTML
      };

      tempBooks.push(book);

    }
    updateGroupBooks(targetID, tempBooks);

    location.reload();
  });

}


function makeAddBookPopupReady(){
  //const targetID = id;

  document.querySelector('.admin-home-popup-addbook-btn').addEventListener('click', ()=>{
    document.getElementById("admin-home-addBook-popup").classList.remove("hide-admin-addBook-popup");

    document.querySelector('.newBook-name-input').value = "";
    document.querySelector('.newBook-publisher-input').value = "";
    document.querySelector('.newBook-quantity-input').value = "";
    document.querySelector('.newBook-price-input').value = "";
    
  });
}


function makeAddBookButtonInteractive(){

  document.querySelector('.admin-home-addBook-btn').addEventListener('click',()=>{
    const idd = localStorage.getItem('key');
    const tempName = document.querySelector('.newBook-name-input').value;
    const tempPub = document.querySelector('.newBook-publisher-input').value;
    const tempQuantity = parseInt(document.querySelector('.newBook-quantity-input').value, 10);
    const tempPrice =  parseInt(document.querySelector('.newBook-price-input').value, 10) ;

    if(idd!="" && tempName!="" && tempPub!="" && tempQuantity!="" && tempPrice!="")
    {

      if(Number.isInteger(tempQuantity) == true)
      {
        if(Number.isInteger(tempPrice))
        {
          addBookTemporary(idd, tempName, tempPub, tempQuantity, tempPrice);
          document.getElementById("admin-home-addBook-popup").classList.add("hide-admin-addBook-popup");
          renderPopupTableContent(idd);
        }
        else
        {
          document.querySelector('.error-msg').innerHTML = "Please enter interger in Price field";
        }
        
      }
      else
      {
        document.querySelector('.error-msg').innerHTML = "Please enter interger in Quantity field";
      }
      
    }
    else
    {
      document.querySelector('.error-msg').innerHTML = "Please fill all fields";
    }

    
    

    
  });
}

makeAddBookButtonInteractive();