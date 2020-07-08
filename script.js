const rulesBtn = document.getElementById('rules-btn')
const closebtn = document.getElementById('close-btn')
const rules = document.getElementById('rules')
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let score = 0;

const brickColumnCount = 5;
const brickRowCount = 9
const ball = {
    x:canvas.width/2,
    y:canvas.height/2,
    size: 10,
    dx: 4 ,
    dy: -4

}

const paddle = {
    x:canvas.width /2 - 40,
    y: canvas.height - 20,
    w:100,
    h:15,
    speed:8,
    dx:0,
    borderRadius:5,
}
const brickInfo = {
    w:70,
    h:20,
    padding:0,
    offsetX:45,
    offsetY:60,
    
    visible:true,
    
}

//create bricks
const bricks= [];
for(let i = 0;i< brickRowCount; i++)
{
    bricks[i] = [];
    for(let j = 0; j<brickColumnCount; j++)
    {
        const x = i* (brickInfo.w + brickInfo.padding+ brickInfo.offsetX)
        const y = j* (brickInfo.h+ brickInfo.padding+ brickInfo.offsetY)
        bricks[i][j] = {x,y, ...brickInfo}
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.size,0,Math.PI*2,true);
    ctx.fillStyle = "#0095dd"
    ctx.fill();
    ctx.closePath()
}
function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddle.x,paddle.y,paddle.w,paddle.h)
    ctx.fillStyle = "#0095dd";
    ctx.fill();
    ctx.closePath();
}

function drawBricks(){
    bricks.forEach(column =>{
        column.forEach(brick =>{
            ctx.beginPath();
            ctx.rect(brick.x,brick.y,brick.w,brick.h);
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
}

function movePaddle() {
    paddle.x +=paddle.dx;
    
    if(paddle.x + paddle.w > canvas.width)
    {
        paddle.x = canvas.width - paddle.w;
    }

    if(paddle.x < 0)
    {
        paddle.x = 0;
    }
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0)
    {
        ball.dx *= -1;
    }

    if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0)
    {
        ball.dy *= -1;
    }

    if
    (ball.x - ball.size > paddle.x && 
        ball.x + ball.size < paddle.x + paddle.w &&
         ball.y + ball.size > paddle.y)
    {
        ball.dy *= -1;
    }

    bricks.forEach(column => {
        column.forEach(brick => {
            if(brick.visible)
            if(
                ball.x - ball.size > brick.x &&
                ball.x + ball.size < brick.x + brick.w &&
                ball.y + ball.size > brick.y &&
                ball.y - ball.size < brick.y + brick.h
            )
            {
                ball.dy *= -1;
                brick.visible = false;

                increaseScore();
            }
        })
    })

    if(ball.y + ball.size > canvas.height)
    {
        showAllBricks();
        score = 0
    }
}

function increaseScore() {
    score++;

    if(score % (brickRowCount * brickRowCount) ===0)
    {
        showAllBricks();
    }
}

function showAllBricks()
{
    bricks.forEach(column => {
        column.forEach(brick=> (brick.visible = true))
    })
}
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawBall()
    drawPaddle()
    drawScore()
    drawBricks()
}

function drawScore(){
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`,canvas.width - 90,60)
}
function update() {
    movePaddle();
    moveBall();
    draw();
    requestAnimationFrame(update);
}
update();

function keyDown(e) {
    if(e.key === 'Right' || e.key=== 'ArrowRight')
    {
        paddle.dx = paddle.speed;
    }else if(e.key === 'Left' || e.key ==='ArrowLeft')
    {
        paddle.dx = -paddle.speed
    }
}

function keyUp(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft')
    {
        paddle.dx = 0;
    }
}

document.addEventListener('keydown' , keyDown);
document.addEventListener('keyup' , keyUp);

rulesBtn.addEventListener('click' , () => rules.classList.add('show') );

closebtn.addEventListener('click' , () => rules.classList.remove('show'))