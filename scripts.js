const canvas = document.querySelector('.drawing-field')
const header = document.querySelector('.header')
const headerH = header.getBoundingClientRect().height

const ctx = canvas.getContext('2d')

let X = null
let Y = null

const drawLine = (ctx, X, Y, toX, toY) => {
    ctx.beginPath()
    ctx.moveTo(X, Y)
    ctx.lineTo(toX, toY)
    ctx.stroke()
}

let draw = false

// Drawing canvas
window.addEventListener("mousemove", (e) => {
    if (X == null || Y == null) {
        X = e.clientX;
        Y = e.clientY - headerH;
        return;
    }

    let curX = e.clientX
    let curY = e.clientY - headerH


    if (draw) {
        drawLine(ctx, X, Y, curX, curY)
    }

    X = curX
    Y = curY
})

window.addEventListener('mousedown', (e) => {
    draw = true
})

window.addEventListener('mouseup', (e) => {
    X = null
    Y = null
    draw = false
})

// Handle the case when user resizes the web page
const updateCanvasSize = () => {
    const W = canvas.width, H = canvas.height
    let tmp = ctx.getImageData(0, 0, W, H)
    const canvasW = canvas.getBoundingClientRect().width
    const canvasH = canvas.getBoundingClientRect().height
    canvas.height = canvasH
    canvas.width = canvasW
    ctx.putImageData(tmp, 0, 0)
    ctx.lineWidth = 5
    ctx.fillStyle = "red"
}

window.addEventListener('resize', (e) => {
    updateCanvasSize()
})

updateCanvasSize()

// Clear utility
const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const clearBtn = document.querySelector('.clear-btn')
clearBtn.addEventListener('click', clearCanvas)

// Save utility (Test)


const saveCanvas = () => {

    const savePng = () => {
        const imgUrl = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = 'grayscale.png'
        link.href = imgUrl
        link.click()
    }

    savePng()
}

const saveBtn = document.querySelector('.save-btn')
saveBtn.addEventListener('click', saveCanvas)