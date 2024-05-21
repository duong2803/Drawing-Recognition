const playerName = window.localStorage.getItem('playerName')
const roomName = window.localStorage.getItem('roomName')

const socket = new WebSocket(`ws://127.0.0.1:8000/ws/drawing/room/${roomName}/${playerName}`)

socket.addEventListener('open', () => {
	console.log('Connection established.')
})

socket.addEventListener('message', (e) => {
	const data = JSON.parse(e.data)

	const type = data['type']
	const payload = data['payload']

	switch (type) {
		case 'player_id': {
			const playerId = payload['player_id']
			window.localStorage.setItem('playerId', playerId)
			break
		}
		case 'player_join': {
			const playerName = payload['player_name']
			showNotification(`Player ${playerName} has joined the room.`)

			const room_players = JSON.parse(payload['players_list'])

			const playerList = document.querySelector('#players-list')
			playerList.innerHTML = ''
			console.log(playerList)

			for (const player of room_players) {
				const playerCard = document.createElement('div')
				playerCard.className = 'player-card'
				playerCard.innerHTML = `<h1><i class="fa-solid fa-user"></i> ${player}</h1>`
				playerList.appendChild(playerCard)
			}

			break
		}

		case 'player_exit': {
			const playerName = payload['player_name']
			showNotification(`Player ${playerName} has left the room.`)

			const room_players = JSON.parse(payload['players_list'])
			const playerList = document.querySelector('#players-list')
			playerList.innerHTML = ''
			console.log(playerList)

			for (const player of room_players) {
				const playerCard = document.createElement('div')
				playerCard.className = 'player-card'
				playerCard.innerHTML = `<h1><i class="fa-solid fa-user"></i> ${player}</h1>`
				playerList.appendChild(playerCard)
			}
			break
		}

		case 'ready': {
			const readyList = JSON.parse(payload['ready_list'])
			const playerCards = document.querySelectorAll('.player-card')

			for (let i = 0; i < readyList.length; ++i) {
				if (readyList[i] == true)
					playerCards[i].style.opacity = 1
				else
					playerCards[i].style.opacity = 0.4
			}
			break
		}

		case 'ready_cancel': {
			const readyList = JSON.parse(payload['ready_list'])
			const playerCards = document.querySelectorAll('.player-card')

			for (let i = 0; i < readyList.length; ++i) {
				if (readyList[i] == true)
					playerCards[i].style.opacity = 1
				else
					playerCards[i].style.opacity = 0.4
			}
			break
		}
	}
})

socket.addEventListener('close', () => {
	console.log("Closed socket.")
})

const returnBtn = document.querySelector('.return-btn')

returnBtn.addEventListener('click', (e) => {
	e.preventDefault()

	window.localStorage.removeItem('playerName')
	window.localStorage.removeItem('roomName')
	window.localStorage.removeItem('playerId')

	socket.close()
	window.location.href = './lobby.html'
})

const readyBtn = document.querySelector('.ready-btn')

readyBtn.addEventListener('click', (e) => {
	e.preventDefault()
	
})

const toastContainer = document.getElementById("toastContainer");

const showNotification = (content) => {
	const notification = document.createElement("div");
	notification.classList.add("toast", "top-right");
	notification.textContent = content;

	toastContainer.appendChild(notification);

	// Reset top position of all notifications
	const notifications = toastContainer.querySelectorAll('.toast');
	notifications.forEach(function (notification, index) {
		const topPosition = 20 + index * (notification.offsetHeight + 10);
		notification.style.top = topPosition + "px";
	});

	setTimeout(function () {
		notification.classList.add("hide");
		setTimeout(function () {
			toastContainer.removeChild(notification);
			moveUpNotifications();
		}, 500); // Wait for transition to finish before removing
	}, 3000); // Hide after 3 seconds

}

const moveUpNotifications = () => {
	const notifications = toastContainer.querySelectorAll('.toast:not(.hide)');
	notifications.forEach(function (notification, index) {
		const topPosition = 20 + index * (notification.offsetHeight + 10);
		notification.style.top = topPosition + "px";
	});
}