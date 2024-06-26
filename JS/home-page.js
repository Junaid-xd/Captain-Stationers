import { groups } from "./group.js";


function renderContent(){

  document.querySelector('.home-page-main-grid').innerHTML = '';

  groups.forEach((group)=>{
    document.querySelector('.home-page-main-grid').innerHTML += `
    <div class="group-wraper-div" data-group-id=${group.groupID}>
      <p>${group.groupName}</p>
    </div>
    `;
  })

  makeGroupsInteractive();
  makeAdminSettingsButtonInteractive();

}

renderContent();


function makeGroupsInteractive(){

  document.querySelectorAll('.group-wraper-div').forEach((group)=>{
    group.addEventListener('click', ()=>{
      const target = group.getAttribute('data-group-id');
      localStorage.setItem('sale-groupID', JSON.stringify(target));
      window.location.assign('./group-sales-detail.html');
      
    });
  });

}

function makeAdminSettingsButtonInteractive(){
  document.querySelector('.nav-admin-btn').addEventListener('click', ()=>{
    window.location.assign('./admin-login.html');
  });
}