const playerName = window.localStorage.getItem('playerName')
const roomName = window.localStorage.getItem('roomName')

const socket = new WebSocket(`ws://127.0.0.1:8000/ws/drawing/room/${roomName}/${playerName}`)
// const socket = new WebSocket(`ws://192.168.1.2:8000/ws/drawing/room/${roomName}/${playerName}`)

socket.addEventListener('open', () => {
	console.log('Connection established.')
})

var timerValue = 60
var intervalId

const countDown = document.querySelector('#countdown')
const updateTimer = () => {
	if (timerValue > 0)
		timerValue--

	countDown.textContent = timerValue
}

var playerId
socket.addEventListener('message', (e) => {
	const data = JSON.parse(e.data)

	const type = data['type']
	const payload = data['payload']

	switch (type) {
		case 'player_id': {
			playerId = JSON.parse(payload['player_id'])
			// window.localStorage.setItem('playerId', playerId)
			break
		}
		case 'player_join': {
			const playerName = payload['player_name']
			showNotification(`Player ${playerName} has joined the room.`)

			const room_players = JSON.parse(payload['players_list'])

			const playerList = document.querySelector('#players-list')
			playerList.innerHTML = ''

			for (const player of room_players) {
				const playerCard = document.createElement('div')
				playerCard.className = 'player-card'
				playerCard.innerHTML = `<h1><i class="fa-solid fa-user"></i> ${player}</h1>`
				playerList.appendChild(playerCard)
			}

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

		case 'player_exit': {
			const playerName = JSON.parse(payload['player_name'])
			showNotification(`Player ${playerName} has left the room.`)

			const room_players = JSON.parse(payload['players_list'])
			const playerList = document.querySelector('#players-list')
			playerList.innerHTML = ''

			for (const player of room_players) {
				const playerCard = document.createElement('div')
				playerCard.className = 'player-card'
				playerCard.innerHTML = `<h1><i class="fa-solid fa-user"></i> ${player}</h1>`
				playerList.appendChild(playerCard)
			}

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

		case 'ready': {
			const playerName = JSON.parse(payload['player_name'])
			const readyList = JSON.parse(payload['ready_list'])
			const playerCards = document.querySelectorAll('.player-card')

			for (let i = 0; i < readyList.length; ++i) {
				if (readyList[i] == true)
					playerCards[i].style.opacity = 1
				else
					playerCards[i].style.opacity = 0.4
			}

			showNotification(`Player ${playerName} has been ready!`)
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

		case 'start_game': {


			const readyBtn = document.querySelector('.ready-btn')
			readyBtn.innerHTML = 'Ready'
			// window.location.href = './index.html'
			const room = document.querySelector('#container')
			// room.classList.remove('active')
			room.style.display = 'none'

			const game = document.querySelector('#container2')
			game.style.display = 'block'

			const questions = JSON.parse(payload['questions'])
			console.log(questions)

			const drawingChooserBtns = document.querySelectorAll('.drawing-chooser-btn')

			for (let i = 0; i < questions.length; ++i) {
				drawingChooserBtns[i].setAttribute('value', questions[i])
			}

			setQuestionLabel(questions[0])
			window.localStorage.setItem('label', questions[0])
			showNotification('Game has started!!')

			timerValue = 60
			intervalId = setInterval(updateTimer, 1000)
			break
		}

		case 'verdict': {
			const verdict = JSON.parse(payload['verdict'])
			let color
			if (verdict == 'Accepted') {
				color = '#129606'
				showNotification(`<i class="fa-regular fa-circle-check" style="color: ${color};"></i>   ${verdict}`, `font-size: 30px; color: ${color};`)
			} else {
				color = '#ff0000'
				showNotification(`<i class="fa-regular fa-circle-xmark" style="color: ${color};"></i> ${verdict}`, `font-size: 30px; color: ${color};`)
			}

			const drawingChooserBtns = document.querySelectorAll('.drawing-chooser-btn')
			for (const btn of drawingChooserBtns) {
				if (btn.getAttribute('value') == window.localStorage.getItem('label')) {
					btn.style.backgroundColor = color
				}
			}
			break
		}

		case 'game_end': {
			console.log('End game')
			showNotification('<i class="fa-regular fa-clock"></i> Time\'s up!', 'font-size: 30px')
			const event = new Event('click')
			document.querySelector('.clear-btn').dispatchEvent(event)

			const drawingChooserBtns = document.querySelectorAll('.drawing-chooser-btn')
			const color = '#354154'
			for (const btn of drawingChooserBtns) {
				btn.style.backgroundColor = color
			}
			timerValue = 60
			clearInterval(intervalId)
			break
		}

		case 'scoreboard': {
			const scoreboard = JSON.parse(payload['scoreboard'])

			for (const result of scoreboard) {
				console.log(result)
			}

			scoreboard.sort((a, b) => {
				if (a.solved != b.solved) {
					return b.penalty - a.penalty
				}
				return a.solved - b.solved
			})

			console.log(scoreboard)

			const players = [
				// { name: 'Player 1', points: 10, penalty: 2 },
				// { name: 'Player 2', points: 15, penalty: 3 },
				// { name: 'Player 3', points: 8, penalty: 1 }
			];

			for(const result of scoreboard){
				players.push({
					name: result.name,
					points: result.solved,
					penalty: result.penalty
				})
			}
			populateScoreboard(players)

			let rank = 0

			for (let i = 0; i < scoreboard.length; ++i) {
				if (scoreboard[i].id == playerId) {
					rank = i + 1
				}
			}

			const yesBtn = document.getElementById('yesBtn');
			const noBtn = document.getElementById('noBtn');

			yesBtn.innerHTML = 'Exit'
			yesBtn.style.fontSize = '30px'
			noBtn.innerHTML = 'Back to room'
			noBtn.style.fontSize = '30px'

			yesBtn.addEventListener('click', function () {

				const scoreboard = document.querySelector('#scoreboardTable')
				scoreboard.style.display = 'none'
				localStorage.clear()
				closeModal();

				window.location.href = './lobby.html'
			});

			noBtn.addEventListener('click', function () {

				const scoreboard = document.querySelector('#scoreboardTable')
				scoreboard.style.display = 'none'
				const room = document.querySelector('#container')
				// room.classList.remove('active')
				room.style.display = 'flex'

				const game = document.querySelector('#container2')
				game.style.display = 'none'

				closeModal();
			});
			openModal(`You are top ${rank}!`)
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

	console.log(readyBtn.innerHTML)
	if (readyBtn.innerHTML == 'Ready') {
		socket.send(JSON.stringify({
			'type': 'ready'
		}))
		readyBtn.innerHTML = 'Cancel ready'
	} else if (readyBtn.innerHTML == 'Cancel ready') {
		socket.send(JSON.stringify({
			'type': 'ready_cancel'
		}))
		readyBtn.innerHTML = 'Ready'
	}

})

const toastContainer = document.getElementById('toastContainer');


// Toast notification by ChatGPT :v
const showNotification = (content, style = '') => {
	const notification = document.createElement('div')
	notification.classList.add('toast', 'top-right')
	notification.innerHTML = content;
	notification.style = style

	toastContainer.appendChild(notification);

	// Reset top position of all notifications
	const notifications = toastContainer.querySelectorAll('.toast')
	notifications.forEach(function (notification, index) {
		const topPosition = 20 + index * (notification.offsetHeight + 10)
		notification.style.top = topPosition + 'px'
	});

	setTimeout(function () {
		notification.classList.add("hide")
		setTimeout(function () {
			toastContainer.removeChild(notification);
			moveUpNotifications();
		}, 500); // Wait for transition to finish before removing
	}, 3000); // Hide after 3 seconds
}

const moveUpNotifications = () => {
	const notifications = toastContainer.querySelectorAll('.toast:not(.hide)')
	notifications.forEach(function (notification, index) {
		const topPosition = 20 + index * (notification.offsetHeight + 10);
		notification.style.top = topPosition + 'px'
	});
}


// ---------------------------------------------------------------------------------------------------------

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
			'type': 'submit',
			'grid': JSON.stringify(grid),
			'label': JSON.stringify(window.localStorage.getItem('label'))
		}

		socket.send(JSON.stringify(data))

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

	// const modal = document.getElementById('modal');
	openModal('Do you want to exit?')

	const yesBtn = document.getElementById('yesBtn');
	const noBtn = document.getElementById('noBtn');

	yesBtn.innerHTML = 'Yes'
	noBtn.innerHTML = 'No'


	yesBtn.addEventListener('click', function () {

		localStorage.clear()
		closeModal();

		window.location.href = './lobby.html'
	});

	noBtn.addEventListener('click', function () {
		closeModal();
	});
})

const setQuestionLabel = (label) => {
	const questionLabel = document.querySelector('#question>h1')
	questionLabel.innerHTML = `Draw a ${label}`
}

const drawingChooserField = document.querySelector('.drawing-chooser-field')

drawingChooserField.addEventListener('click', (e) => {
	if (e.target.tagName == 'BUTTON') {
		const value = e.target.getAttribute('value')
		localStorage.setItem('label', value)
		setQuestionLabel(value)
	}
})

const modal = document.getElementById('modal');
const quitModal = document.querySelector('.quit-modal')
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

function openModal(content) {
	modal.style.display = 'block';
	const modalContent = document.querySelector('.modal-content')
	modalContent.innerHTML = content
}

function closeModal() {
	modal.style.display = 'none';
}



function populateScoreboard(players) {
	const tbody = document.querySelector('#scoreboardTable tbody');
	tbody.innerHTML = '';

	players.forEach(player => {
		const row = document.createElement('tr');

		const nameCell = document.createElement('td');
		nameCell.textContent = player.name;
		row.appendChild(nameCell);

		const pointsCell = document.createElement('td');
		pointsCell.textContent = player.points;
		row.appendChild(pointsCell);

		const penaltyCell = document.createElement('td');
		penaltyCell.textContent = player.penalty;
		row.appendChild(penaltyCell);

		tbody.appendChild(row);
	});
	const scoreboard = document.querySelector('#scoreboardTable')
	scoreboard.style.display = 'table'
}

