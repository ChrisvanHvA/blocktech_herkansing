const forms = document.querySelectorAll("form");


forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    console.log("yes")
    //prevent the html submit
    e.preventDefault();
    //post the form yourself via JavaScript
    fetch(e.target.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      console.log("Request complete! response:", res);
    });
  });
});



// forms.forEach((form) => {
//   form.addEventListener("submit", (e) => {
//     console.log("yes")
//     //prevent the html submit
//     e.preventDefault();
//     //post the form yourself via JavaScript
//     fetch(e.target.action, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//     }).then((res) => {
//       console.log("Request complete! response:", res);
//     });
//   });
// });
