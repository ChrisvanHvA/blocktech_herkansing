let email = document.getElementById('email')
let message =document.getElementById('message')
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  
  let formData = {
      email: email.value,
      message: message.value
  }
  console.log(formData);

  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/');
  xhr.setRequestHeader('content-type', 'application/json');
xhr.onload = function(){
    console.log(xhr.responseText);
    if(xhr.responseText == 'success'){
        alert('Email sent');
        email.value = '';
        message.value = '';
    }else{
        alert('Something went wrong')
    }
}
xhr.send(JSON.stringify(formData))
})