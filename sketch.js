function setup() {
    const canvas = createCanvas(280, 280)
    canvas.parent('drawing-field')

    canvas.background(255)

    // Clear utility
    const clearBtn = document.querySelector('.clear-btn')
    clearBtn.addEventListener('click', () => {
        canvas.background(255)
    })

    // Save utility
    // const saveBtn = document.querySelector('.save-btn')
    const saveBtn = select('.save-btn')
    const getPrediction = async (url, data) => {
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            if (res.status != 200) return
            const prediction = await res.json()
            return prediction
        } catch (error) {
            console.log(error)
        }
    }


    saveBtn.mousePressed(async () => {
        let img = canvas.get()
        img.resize(28, 28)
        img.loadPixels()
        // console.log(img.pixels)
        const grid = []
        for (let i = 0; i < 784; ++i) {
            grid[i] = (255 - img.pixels[i * 4]) / 255
        }
        const data = {
            grid: grid
        }
        const res = await getPrediction('http://localhost:8000/get-prediction/', data)
        const prediction = res['prediction']
        const probability = res['probability']

        const predictionText = document.querySelector('.prediction-text')
        predictionText.innerHTML = "Prediction:"
        predictionText.innerHTML += "<br/>"
        for (let i = 0; i < prediction.length; ++i) {
            predictionText.innerHTML += `${prediction[i]}(${Number(probability[i]).toFixed(2)}%)`
            predictionText.innerHTML += "<br/>"
        }
    })
}

function draw() {


    strokeWeight(8)
    stroke(0)
    if (mouseIsPressed) {
        line(pmouseX, pmouseY, mouseX, mouseY)
    }
}