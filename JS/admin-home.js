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
import { returnNewUniqueGroupID } from './group.js';
import { addNewGroup } from './group.js';



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


  makeLogoutButtonInteractive();
  interactiveDeleteandEditButton();
  makePopupHide();
  openCreateNewGroupPopup()
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

function makePopupHide(){
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

  document.querySelector('.newBook-close-btn').addEventListener('click',()=>{
    document.getElementById("add-newBook-form-div").classList.add("hide-create-new-group-popup");
    document.querySelector('.admin-newGroup-tempBooks-table-head').innerHTML="";
    document.querySelector('.admin-newGroup-tempBooks-table-body').innerHTML="";
    document.querySelector('.add-newBook-name-input').value = "";
    localStorage.removeItem("tempBook");
    
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



function makeLogoutButtonInteractive(){
  document.querySelector('.log-out-btn').addEventListener('click', ()=>{
    window.location.assign('../index.html');
  });
}


function openCreateNewGroupPopup(){
  document.querySelector('.new-group-btn').addEventListener('click', ()=>{
    document.getElementById("add-newBook-form-div").classList.remove("hide-create-new-group-popup");
    localStorage.removeItem("tempGroup");
    makeNewBookSaveButtonInteractive();
    makeAddNewBookButtonInteractive();
  });
}



function makeAddNewBookButtonInteractive(){
  document.querySelector('.form-newBook-add-btn').addEventListener('click', ()=>{
    const tempName = document.querySelector('.add-newBook-name-input').value;
    if(tempName!=""){
      document.querySelector('.name-err-msg-div').innerHTML = "";
      const tempID = returnNewUniqueGroupID();

      let tempGroup = JSON.parse(localStorage.getItem('tempGroup'));

      if(!tempGroup){
        tempGroup = {
          groupID:parseInt(tempID),
          groupName:tempName,
          books:[]
        }
      }

      

      


      const tempBookName = document.querySelector('.newBook-form-name-input').value;
      const tempBookPub = document.querySelector('.newBook-form-publisher-input').value;
      const tempBookQuantity = document.querySelector('.newBook-form-quantity-input').value;
      const tempBookPrice = document.querySelector('.newBook-form-price-input').value;

      if(tempBookName!="" && tempBookPub!="" && tempBookQuantity!="" && tempBookPrice!=""){

        document.querySelector('.final-newBook-error-div').innerHTML = "";
        document.querySelector('.newBook-details-error-div').innerHTML = "";

        let inn = 0 ;
        let tempBookID = tempGroup.books.length + 1;

        while(1){
          tempGroup.books.forEach((book)=>{
            if(book.bookID==tempBookID){
              inn = 1
              tempBookID++;
            }
          });

          if(inn==1){
            inn=0;
            continue;
          }
          else{
            break;
          }
          
        }
        
        let newTempBook = {
          bookID: parseInt(tempBookID),
          bookName: tempBookName,
          publication:tempBookPub,
          quantity:parseInt(tempBookQuantity),
          price : parseInt(tempBookPrice)
        }

        
        tempGroup.books.push(newTempBook);


        document.querySelector('.newBook-form-name-input').value = "";
        document.querySelector('.newBook-form-publisher-input').value = "";
        document.querySelector('.newBook-form-quantity-input').value = "";
        document.querySelector('.newBook-form-price-input').value = "";

        localStorage.setItem("tempGroup" , JSON.stringify(tempGroup));

        console.log(tempGroup);
        
        showTempDataInTabel(tempGroup);


      }
      else{
        document.querySelector('.newBook-details-error-div').innerHTML = "Please fill all fields *";
      }

    }
    else{
      document.querySelector('.name-err-msg-div').innerHTML = "Please enter group name *";
    }
  });
}


function showTempDataInTabel(tempGroup){

  let tableHead = document.querySelector('.admin-newGroup-tempBooks-table-head');
  let tableBody = document.querySelector('.admin-newGroup-tempBooks-table-body');


  
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
  tempGroup.books.forEach((book)=>{
    tableBody.innerHTML += `
    <tr class="admin-popup-table-row">
      <td>${counter}</td>
      <td contenteditable="true" class="admin-home-name-col">${book.bookName}</td>
      <td class="admin-home-popup-table-publisher" contenteditable="true">${book.publication}</td>
      <td contenteditable="true">${book.quantity}</td>
      <td contenteditable="true">${book.price}</td>
      <td><button class="admin-home-newGroup-remove-btn" data-remove-newGroup-bookID="${book.bookID}">Remove</button></td>
    </tr>
    `;
    counter++;
  });
    
  makeNewGroupRemoveButtonInteractive(tempGroup);

}


function makeNewGroupRemoveButtonInteractive(tempGroup){

  document.querySelectorAll('.admin-home-newGroup-remove-btn').forEach((button)=>{

    document.querySelectorAll('.admin-home-newGroup-remove-btn').forEach((button) => {
      button.addEventListener('click', function() {
        const targetBookID = this.getAttribute("data-remove-newGroup-bookID");
        tempGroup.books = tempGroup.books.filter(book => book.bookID != targetBookID);

        localStorage.setItem("tempGroup", JSON.stringify(tempGroup));
        showTempDataInTabel(tempGroup);
        
      });
    });

  });
  
}


function makeNewBookSaveButtonInteractive(){

  document.querySelector('.newBook-form-save-btn').addEventListener('click', ()=>{

    if(document.querySelector('.add-newBook-name-input').value!=""){

      document.querySelector('.name-err-msg-div').innerHTML="";
      const newGroup = JSON.parse(localStorage.getItem("tempGroup"));
      if(!newGroup){
        document.querySelector('.final-newBook-error-div').innerHTML = "Please add atleast one book";
      }
      else{

        addNewGroup(newGroup);
        location.reload();
      }
    }
    else{
      document.querySelector('.name-err-msg-div').innerHTML="Please enter group name *";
    }
    
  })
}
