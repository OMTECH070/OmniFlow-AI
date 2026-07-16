document
.getElementById("sendBtn")
.addEventListener("click", () => {

const text =
document.getElementById("question").value;

document.getElementById("response").innerText =
"You asked: " + text;

});