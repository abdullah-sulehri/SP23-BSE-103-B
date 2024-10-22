
function handleFormSubmit(event) {
    console.log("Handler Called");

    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let address = document.getElementById("address");
    let city = document.getElementById("city");

    let errorMessage1 = document.getElementById("error-message-name");
    let errorMessage2 = document.getElementById("error-message-email");
    let errorMessage3 = document.getElementById("error-message-address");
    let errorMessage4 = document.getElementById("error-message-city");
    resetErrorMessages([errorMessage1, errorMessage2, errorMessage3, errorMessage4]);


    if (name.value && email.value && address.value && city.value) {
        console.log("valid form")
        alert("Form submitted successfully!")
        
    } else {
        console.log("Invalid Form");
        // alert("Form submission failed! Please fill in all required fields correctly.");
        if (!name.value){
        
        messageStyle(errorMessage1);
        }
        if (!email.value){
        
        messageStyle(errorMessage2);
        }
        if (!address.value){
        
        messageStyle(errorMessage3);
        }
        if (!city.value){
        
        messageStyle(errorMessage4);
        }

        event.preventDefault();
        
    }
}
function messageStyle(message){
    message.style.display = "inline";
    message.style.color="red";
}

function resetErrorMessages(messages) {
    messages.forEach(message => {
        message.style.display = "none"; 
    });
}


window.onload = function () {
    var gform = document.getElementById("checkoutForm");
    gform.onsubmit = handleFormSubmit;

    const inputs = ["name", "email", "address", "city"];
    
    for (let i = 0; i < inputs.length; i++) {
    const id = inputs[i];
        const input = document.getElementById(id);
        const errorMessage = document.getElementById(`error-message-${id}`);

        input.addEventListener("input", function() {
            if (input.value) {
                errorMessage.style.display = "none";
            }
        });
    };
}

