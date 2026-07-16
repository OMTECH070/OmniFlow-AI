const BASE_URL="http://localhost:8000";

export async function askAI(prompt){

const response=await fetch(BASE_URL+"/chat",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

prompt

})

});

return response.json();

}