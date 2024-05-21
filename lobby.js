// const socket = new WebSocket('ws://127.0.0.1:8000/ws/drawing/game/2/Jack');

// socket.addEventListener('open', (event) => {
//     console.log("Websocket connection established")
//     socket.send(JSON.stringify({
//         type: 'chat',  
//         payload: 'Xin chao' 
//     }))
// })

const btn = document.querySelector('.join-room-btn')
btn.addEventListener('click', () => {

    const playerName = document.querySelector('#username').value
    const roomName = document.querySelector('#roomname').value

    console.log(`player name: ${playerName}`)
    console.log(`room name: ${roomName}`)

    if(playerName.length == 0 || roomName.length == 0){
        
        return
    }

    window.localStorage.setItem('playerName', playerName)
    window.localStorage.setItem('roomName', roomName)

    window.location.href = './room.html'
})