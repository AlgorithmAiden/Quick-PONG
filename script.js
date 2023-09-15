//setup the canvas
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

/**make the canvas always fill the screen**/;
(function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    window.onresize = resize
})()
    ;
//for this code (as in code before this line), I almost always use the same stuff, so its going to stay here

//this is the game update speed
let ups = 50

//create the paddles
let robotLevel = 3
let robotPaddle = {
    x: canvas.width / 2,
    sx: 0,
    width: 200,
    acceleration: 1,
    breakingForce: 1,
    maxSpeed: 25
}

let playerLevel = 3
let playerPaddle = {
    x: canvas.width / 2,
    sx: 0,
    width: 200,
    acceleration: 1,
    breakingForce: 1,
    maxSpeed: 25
}

//and the paddle vars
let paddleHeight = 25

//create the ball
let ball = { r: 25 }

//and the reset function
function reset() {
    //choose where to put the ball
    const top = (Math.random() < .5)

    //reset the balls speed
    ball.s = 10

    //set the x to anywhere on the screen
    ball.x = Math.random() * (canvas.width - ball.r * 2) + ball.r

    //set the y to the top or bottom
    ball.y = canvas.height * (top ? .15 : .85)

    //set the x speed to left or right
    ball.sx = (Math.round(Math.random()) * 2 - 1) * ball.s

    //set the y speed to make it move away from the close wall
    ball.sy = ball.s * (top ? 1 : -1)

}
//reset the new ball
reset()

//this will hold the score
let score = {
    robot: 0,
    player: 0
}

//record the last place the mouse was at
let lastX = canvas.width / 2
document.addEventListener('mousemove', e => lastX = e.x)

//or player finger
document.addEventListener('touchmove', e => lastX = e.changedTouches[e.changedTouches.length - 1].clientX)
const pointsToWIn = 10

//check for a win, and display it if it happens
function checkWin() {
    if (score.robot == pointsToWIn || score.player == pointsToWIn) {
        const text = [
            "Better luck next time\nOh wait, there is no luck\nYou're just bad",
            "You won!"][score.robot == pointsToWIn ? 0 : 1]
        alert(text)
        reset()
        robotLevel = 3
        playerLevel = 3
        score.robot = 0
        score.player = 0
        robotPaddle.x = canvas.width / 2
        playerPaddle.x = canvas.width / 2
        balance(false,true)
    }
}

//this holds the stats for the levels
const levels = [
    {
        width: 100,
        acceleration: .25,
        breakingForce: .25,
        maxSpeed: 10
    },
    {
        width: 150,
        acceleration: .5,
        breakingForce: .5,
        maxSpeed: 15
    },
    {
        width: 200,
        acceleration: 1,
        breakingForce: 1,
        maxSpeed: 25

    },
    {
        width: 250,
        acceleration: 1.5,
        breakingForce: 1.5,
        maxSpeed: 35

    },
    {
        width: 300,
        acceleration: 2,
        breakingForce: 2,
        maxSpeed: 40
    }
]

//helps / hurts the players / robots to help keep an even score
function balance(helpRobot, noChange = false) {
    if (!noChange) {
        if (helpRobot) {
            if (playerLevel > 1) playerLevel--
            if (robotLevel < 5) robotLevel++
        }
        else {
            if (robotLevel > 1) robotLevel--
            if (playerLevel < 5) playerLevel++
        }
    }
    robotPaddle.width = levels[robotLevel - 1].width
    robotPaddle.acceleration = levels[robotLevel - 1].acceleration
    robotPaddle.breakingForce = levels[robotLevel - 1].breakingForce
    robotPaddle.maxSpeed = levels[robotLevel - 1].maxSpeed

    playerPaddle.width = levels[playerLevel - 1].width
    playerPaddle.acceleration = levels[playerLevel - 1].acceleration
    playerPaddle.breakingForce = levels[playerLevel - 1].breakingForce
    playerPaddle.maxSpeed = levels[playerLevel - 1].maxSpeed
}

//this will be the logic loop
setInterval(() => {

    //move the ball
    ball.x += ball.sx
    ball.y += ball.sy

    //bounce off the walls
    if (ball.x - ball.r < 0) ball.sx = ball.s
    if (ball.x + ball.r > canvas.width) ball.sx = -ball.s

    //reset if it hits the other ends
    //and it will tell you if you won or not
    if (ball.y - ball.r < 0) {
        score.player++
        balance(true)
        reset()
        checkWin()
    }
    if (ball.y + ball.r > canvas.height) {
        score.robot++
        balance(false)
        reset()
        checkWin()
    }

    //check for paddle hits
    if (ball.y - ball.r <= paddleHeight &&
        ball.x + ball.r >= robotPaddle.x - robotPaddle.width / 2 &&
        ball.x - ball.r <= robotPaddle.x + robotPaddle.width / 2) {
        ball.sy = ball.s
        ball.s++
    }

    if (ball.y + ball.r >= canvas.height - paddleHeight &&
        ball.x + ball.r >= playerPaddle.x - playerPaddle.width / 2 &&
        ball.x - ball.r <= playerPaddle.x + playerPaddle.width / 2) {
        ball.sy = -ball.s
        ball.s++
    }

    //move the player paddle closer to the mouse
    if (playerPaddle.x < lastX) {
        if (playerPaddle.sx < 0) playerPaddle.sx += playerPaddle.breakingForce
        playerPaddle.sx += Math.min(lastX - (playerPaddle.x), playerPaddle.acceleration)
    }
    if (playerPaddle.x > lastX) {
        if (playerPaddle.sx > 0) playerPaddle.sx -= playerPaddle.breakingForce
        playerPaddle.sx -= Math.min((playerPaddle.x) - lastX, playerPaddle.acceleration)
    }
    playerPaddle.sx = Math.max(Math.min(playerPaddle.sx, playerPaddle.maxSpeed), -playerPaddle.maxSpeed)
    playerPaddle.x += playerPaddle.sx

    //move the robot paddle closer to the ball
    if (robotPaddle.x < ball.x) {
        if (robotPaddle.sx < 0) robotPaddle.sx += robotPaddle.breakingForce
        robotPaddle.sx += Math.min(ball.x - (robotPaddle.x), robotPaddle.acceleration)
    }
    if (robotPaddle.x > ball.x) {
        if (robotPaddle.sx > 0) robotPaddle.sx -= robotPaddle.breakingForce
        robotPaddle.sx -= Math.min((robotPaddle.x) - ball.x, robotPaddle.acceleration)
    }
    robotPaddle.sx = Math.max(Math.min(robotPaddle.sx, robotPaddle.maxSpeed), -robotPaddle.maxSpeed)
    robotPaddle.x += robotPaddle.sx

    //keep the paddles from going off screen
    if (robotPaddle.x - robotPaddle.width / 2 < 0) {
        robotPaddle.x = robotPaddle.width / 2
        robotPaddle.sx = Math.max(0, robotPaddle.sx)
    }
    if (robotPaddle.x + robotPaddle.width / 2 > canvas.width) {
        robotPaddle.x = canvas.width - robotPaddle.width / 2
        robotPaddle.sx = Math.min(0, robotPaddle.sx)
    }

    if (playerPaddle.x - playerPaddle.width / 2 < 0) {
        playerPaddle.x = playerPaddle.width / 2
        playerPaddle.sx = Math.max(0, playerPaddle.sx)
    }
    if (playerPaddle.x + playerPaddle.width / 2 > canvas.width) {
        playerPaddle.x = canvas.width - playerPaddle.width / 2
        playerPaddle.sx = Math.min(0, playerPaddle.sx)
    }
}, 1000 / ups)

    //this is the main render loop
    ;
(function render() {
    //clear the screen
    ctx.fillStyle = 'rgb(0,0,0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //draw the ball
    ctx.fillStyle = 'rgb(0,255,0)'
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2)
    ctx.fill()

    //draw the paddles
    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.fillRect(robotPaddle.x - robotPaddle.width / 2, 0, robotPaddle.width, paddleHeight)
    ctx.fillRect(playerPaddle.x - playerPaddle.width / 2, canvas.height - paddleHeight, playerPaddle.width, paddleHeight)

    //draw the score
    ctx.fillStyle = 'rgb(0,100,0)'
    ctx.font = '42px arial'
    ctx.fillText(`Robot: ${score.robot} Player: ${score.player}`, 0, paddleHeight + 42)

    //this will update the loop once per frame of the browser
    requestAnimationFrame(render)
})()
