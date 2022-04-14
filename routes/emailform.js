let email = document.getElementById('email')
let message =document.getElementById('message')
const contactForm = document.querySelector('.contact-form');

// stopt de website van herladen en haalt de email adres en bericht op
contactForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  
  let formData = {
      email: email.value,
      message: message.value
  }
  console.log(formData);
//verwerkt de info van email en message en maakt het een json bestand die opgehaald kan worden in de app.js nodemailer
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/');
  xhr.setRequestHeader('content-type', 'application/json');
xhr.onload = function(){
    console.log(xhr.responseText);
    //als de email succesvol verwerkt is dan geeft hij dat aan en leegt hij de velden, anders geeft hij een error
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