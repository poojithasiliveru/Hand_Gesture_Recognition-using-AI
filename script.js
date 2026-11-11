const URL = "https://teachablemachine.withgoogle.com/models/vQvM_gsxm/";

let model, webcam;
let running = false;

async function startCamera() {

    const button = document.querySelector("button");
    button.disabled = true;
    button.innerText = "Loading...";

    try {

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);

        webcam = new tmImage.Webcam(300, 300, true);

        await webcam.setup();
        await webcam.play();

        document.getElementById("webcam-container")
            .appendChild(webcam.canvas);

        running = true;

        button.innerText = "Camera Started";

        predict();

    } catch (error) {

        console.error("Full error:", error);
        alert("Camera or Model Error: " + String(error));

        button.disabled = false;
        button.innerText = "Start Camera";
    }
}

async function predict() {

    if (!running) return;

    webcam.update();

    const predictions = await model.predict(webcam.canvas);

    predictions.sort((a, b) => b.probability - a.probability);

    document.getElementById("label-container").innerHTML =
        predictions.map(p =>
            `<p>${p.className}: ${(p.probability * 100).toFixed(2)}%</p>`
        ).join("");

    requestAnimationFrame(predict);
}