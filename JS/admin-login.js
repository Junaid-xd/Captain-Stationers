const adminID  = "admin1"
const adminPass  = "admin1"



function makeLoginButtonInteractive(){
  document.querySelector('.admin-login-btn').addEventListener('click',()=>{
    const ID = document.querySelector('.admin-id-input').value;
    const password = document.querySelector('.admin-pass-input').value;
    if(ID!="" && password!=""){
      
      if(ID==adminID && password ==adminPass){
        document.querySelector('.error-div').innerHTML = "";
        document.querySelector('.admin-id-input').value = "";
        document.querySelector('.admin-pass-input').value = "";
        window.location.assign('./admin-home.html');
        
      }
      else{
        document.querySelector('.error-div').innerHTML = "Incorrect ID or Password*";
      }
    }
    else{
      document.querySelector('.error-div').innerHTML = "Please fill all fields*";
    }
  });
}

makeLoginButtonInteractive();