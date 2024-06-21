document.addEventListener("DOMContentLoaded", function() {
    const newText = document.querySelector(".funnyQuote");
    
    newText.addEventListener("click", function() {
        document.getElementById("TextChange").innerText = "Clicking here wont help you find love.";
    });
});