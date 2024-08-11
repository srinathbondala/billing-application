function open_bills(){
    console.log('open bill');
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    if(isEmail(email) && password.length>=6){
        if(password.length>=6){
            window.location.href ='./user_bill/bills.html'; 
        }
        else{
            alert("enter proper Password");
        }
    }
    else{
        alert("enter proper Email");
    }
}
function isEmail(email) { 
    var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
    return regexp.test(String(email).toLowerCase()); 
} 