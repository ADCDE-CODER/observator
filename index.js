const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", async () => {
    const input = document.getElementById("prompt-input").value;
    const output = document.getElementsByClassName("content-main__output")[0];
    const paraInput = document.createElement("p");
    paraInput.innerText = input;
    output.appendChild(paraInput);

    const response = await fetch("http://localhost:3000/prompt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({prompt: input})
    });

    const para = document.createElement("p");
    const result = await response.json();
    para.innerText = result;
    output.appendChild(para);
});