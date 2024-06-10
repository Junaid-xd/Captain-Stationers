
import groups from './group.js';




function renderGroups()
{
  let content = document.querySelector('.admin-flex-box');

  groups.forEach((group)=>{

    content.innerHTML+=`
      <div class="group-wrapper">
        <div class="boundary">
          <div class="admin-name-sec">${group.groupName}</div>
    
          <div class="admin-btn-sec">
            <button>DELETE</button>
            <button>EDIT</button>
          </div>
        </div>
      </div>
    `
  });
}

renderGroups();