const button = document.getElementById("sendBtn");

button.addEventListener("click", async () => {

const prompt = document.getElementById("prompt").value;

const loading = document.getElementById("loading");

const response = document.getElementById("response");

loading.innerText="Thinking...";

response.innerHTML="";

try{

// Temporary Mock

await new Promise(resolve=>setTimeout(resolve,1500));

response.innerHTML="AI Response:<br><br>"+prompt;

loading.innerHTML="";

}

catch(error){

loading.innerHTML="";

response.innerHTML="Something went wrong.";

}

});