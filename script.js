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
let robotPaddleX = canvas.width / 2
let playerPaddleX = canvas.width / 2

//and the paddle vars
let paddleSpeed = 10
let paddleHeight = 25
let paddleWidth = 200

//create the ball
let ball = { r: 25, s: 10 }

//and the reset function
function reset() {
    //choose where to put the ball
    const top = (Math.random() < .5)

    //set the x to anywhere on the screen
    ball.x = Math.random() * (canvas.width - ball.r * 2) + ball.r

    //set the y to the top or bottom
    ball.y = canvas.height * (top ? .15 : .85)

    //set the x speed to left or right
    ball.sx = (Math.round(Math.random()) * 2 - 1) * ball.s

    //set the y speed to make it move away from the close wall
    ball.sy = ball.s * (top ? 1 : -1)

    paddleSpeed = 10
}
//reset the new ball
reset()

//record the last place the mouse was at
let lastX = canvas.width / 2
document.addEventListener('mousemove', e => lastX = e.x)

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
        alert("You won")
        reset()
    }
    if (ball.y + ball.r > canvas.height) {
        alert("You lost")
        reset()
    }

    //check for paddle hits
    if (ball.y - ball.r <= paddleHeight &&
        ball.x + ball.r >= robotPaddleX - paddleWidth / 2 &&
        ball.x - ball.r <= robotPaddleX + paddleWidth / 2) {
        ball.sy = ball.s
        paddleSpeed = Math.max(paddleSpeed - 1, 1)
    }

    if (ball.y + ball.r >= canvas.height - paddleHeight &&
        ball.x + ball.r >= playerPaddleX - paddleWidth / 2 &&
        ball.x - ball.r <= playerPaddleX + paddleWidth / 2) {
        ball.sy = -ball.s
        paddleSpeed = Math.max(paddleSpeed - 1, 1)
    }

    //move the player paddle closer to the mouse
    if (playerPaddleX < lastX)
        playerPaddleX += Math.min(lastX - (playerPaddleX), paddleSpeed)
    if (playerPaddleX > lastX)
        playerPaddleX -= Math.min((playerPaddleX) - lastX, paddleSpeed)

    //move the robot paddle closer to the ball
    if (robotPaddleX < ball.x)
        robotPaddleX += Math.min(ball.x - (robotPaddleX), paddleSpeed)
    if (robotPaddleX > ball.x)
        robotPaddleX -= Math.min((robotPaddleX) - ball.x, paddleSpeed)

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
    ctx.fillRect(robotPaddleX - paddleWidth / 2, 0, paddleWidth, paddleHeight)
    ctx.fillRect(playerPaddleX - paddleWidth / 2, canvas.height - paddleHeight, paddleWidth, paddleHeight)

    //this will update the loop once per frame of the browser
    requestAnimationFrame(render)
})()