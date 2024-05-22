// const playerId = window.localStorage.getItem('playerId')
// const roomName = window.localStorage.getItem('roomName')

// const socket = new WebSocket(`ws://127.0.0.1:8000/ws/drawing/game/${roomName}/${playerId}`)
// var questions

// socket.addEventListener('open', () => {
//     console.log('Game joined!!')
// })

// socket.addEventListener('message', (e) => {
//     const data = JSON.parse(e.data)
//     console.log(data)

//     const type = data['type']
//     const payload = data['payload']

//     switch (type) {
//         case 'questions': {
//             const questions = JSON.parse(payload['questions'])
//             console.log(questions)

//             const drawingChooserBtns = document.querySelectorAll('.drawing-chooser-btn')
//             for (let i = 0; i < questions.length; ++i) {
//                 drawingChooserBtns[i].setAttribute('value', questions[i])
//             }
//             break
//         }
//     }

// })

// socket.addEventListener('close', () => {

// })

function setup() {
    const canvas = createCanvas(280, 280)
    canvas.parent('canvas-field')

    canvas.background(255)

    const clearBtn = document.querySelector('.clear-btn')
    clearBtn.addEventListener('click', () => {
        canvas.background(255)
    })

    const submitBtn = select('.submit-btn')

    submitBtn.mousePressed(async () => {
        let img = canvas.get()
        img.resize(28, 28)
        img.loadPixels()
        const grid = []
        for (let i = 0; i < 784; ++i) {
            grid[i] = (255 - img.pixels[i * 4]) / 255
        }
        const data = {
            grid: grid
        }
        // const res = await getPrediction('http://localhost:8000/get-prediction/', data)
    })
}

function draw() {


    strokeWeight(8)
    stroke(0)
    if (mouseIsPressed) {
        line(pmouseX, pmouseY, mouseX, mouseY)
    }
}

const exitBtn = document.querySelector('.exit-btn')

exitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    localStorage.clear()
    window.location.href = './lobby.html'
})
