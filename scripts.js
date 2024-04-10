const canvas = document.querySelector('.drawing-field')
const header = document.querySelector('.header')
// canvas.height = window.innerHeight
// canvas.width = window.innerWidth

const headerH = header.getBoundingClientRect().height

const updateCanvasSize = () => {
    const canvasW = canvas.getBoundingClientRect().width
    const canvasH = canvas.getBoundingClientRect().height
    canvas.height = canvasH
    canvas.width = canvasW
}

const drawLine = () =>{

}

const ctx = canvas.getContext('2d')

ctx.lineWidth = 5

let X = null
let Y = null

let draw = false

window.addEventListener("mousemove", (e) => {
    if (X == null || Y == null) {
        X = e.clientX;
        Y = e.clientY - headerH;
        return;
    }

    let curX = e.clientX
    let curY = e.clientY - headerH

    if (draw) {
        ctx.beginPath()
        ctx.moveTo(X, Y)
        ctx.lineTo(curX, curY)
        ctx.stroke()
    }

    X = curX
    Y = curY
})

window.addEventListener('mousedown', (e) => {
    console.log(e.clientX)
    console.log(e.clientY)
    draw = true
})

window.addEventListener('mouseup', (e) => {
    X = null
    Y = null
    draw = false
})

window.addEventListener('resize', (e) =>{
    updateCanvasSize()
})
