const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var boy,boyRunning;
var dog,dogRunning;
var canvas;
var jungle,jungleImage;
var obstaclesGroup,obstacleImage;
var fruitsGroup,fruitsImage;
var score=0,hunger=250;
var gameState="play";
var gameOver,gameOverImg;
var restart,restartImg;
var jumping,eating,death,gameOverSound;


function preload() {
    boyRunning=loadAnimation('boy1.png','boy2.png','boy3.png','boy4.png','boy5.png','boy6.png','boy7.png','boy8.png','boy9.png');
    jungleImage=loadImage("bg.png");
    obstacleImage=loadImage("rock.png");
    fruitsImage=loadImage("fruit.png");
    gameOverImg=loadImage("gameOver.png");
    restartImg=loadImage("restart.png");
    jumping=loadSound("jumping.wav");
    eating=loadSound("eating.wav");
    death=loadSound("deathSound.wav");
    gameOverSound=loadSound("gameOver.wav");


}

function setup(){
    canvas=createCanvas(windowWidth,windowHeight);

    jungle = createSprite(0,0,windowWidth,windowHeight);
    jungle.addImage("jungle",jungleImage);
    jungle.x = width /2;
  

    boy=createSprite(300,0);
    boy.addAnimation('boyRunning',boyRunning);

    invisibleGround = createSprite(0,800,4000,10);
    invisibleGround.visible = false;

    gameOver = createSprite(width/2,height/2-200);
    gameOver.addImage('gameOver',gameOverImg);
    
    restart = createSprite(width/2,height/2);
    restart.addImage('restart',restartImg);
    
    gameOver.scale = 0.7;
    restart.scale = 0.2;
  
    gameOver.visible = false;
    restart.visible = false;
  

  obstaclesGroup= new Group();
  fruitsGroup= new Group();


    
  
}

function draw(){
    background("black");
    
    if(gameState==="play"){

      score=score+Math.round(getFrameRate()/60);
      hunger=hunger-Math.round(getFrameRate()/60);
     

      jungle.velocityX=-5

      if(jungle.x<0)
      {
         jungle.x=width/2
      }
  
      if(keyDown("space")&& boy.y>350){
          jumping.play();
          boy.velocityY=-10;
      }
  
      boy.velocityY = boy.velocityY + 0.8
      spawnObstacles();
      spawnFruits();

      boy.collide(invisibleGround);

      if(fruitsGroup.isTouching(boy)){
        eating.play();
        hunger = hunger + 50;
        fruitsGroup.destroyEach();
      }

      if(obstaclesGroup.isTouching(boy)||hunger<0){
        gameOverSound.play();
        gameState = "end";
      }
     
  
     

    }

    else if(gameState==="end"){
     gameOver.x=camera.position.x;
     restart.x=camera.position.x;
      gameOver.visible = true;
      restart.visible = true;
      boy.destroy();
      jungle.velocityX = 0;
      obstaclesGroup.setVelocityXEach(0);
      fruitsGroup.setVelocityXEach(0)
      
      obstaclesGroup.setLifetimeEach(-1);
      fruitsGroup.setLifetimeEach(-1);

      obstaclesGroup.destroyEach();
      fruitsGroup.destroyEach();

     

    }

  





    drawSprites();
    textSize(40);
    fill("black");
    text("SCORE: "+ score,1400,50);

    textSize(40);
    fill("red");
    text("HUNGER: "+ hunger,1400,100);
}

function spawnObstacles() {
    if(frameCount % 120 === 0) {
  
      var obstacle = createSprite(camera.position.x+400,750,40,40);
      obstacle.setCollider("rectangle",0,0,200,200)
      obstacle.debug=true;
      obstacle.addImage(obstacleImage);
      obstacle.velocityX = -6
      obstacle.scale = 0.25;      
  
      obstacle.lifetime = 400;
      obstaclesGroup.add(obstacle);
      
    }
  }

  function spawnFruits() {
    if(frameCount % 200 === 0) {
  
      var fruits = createSprite(camera.position.x+400,random(500,700),40,40);
      fruits.setCollider("rectangle",0,0,200,200)
      fruits.addImage(fruitsImage);
      fruits.velocityX = -8
      fruits.scale = 0.5;      
  
      fruits.lifetime = 400;
      fruitsGroup.add(fruits);
      
    }
  }

  function reset(){
    gameState = play;
    gameOver.visible = false;
  restart.visible = false;
  boy.visible = true;
  obstaclesGroup.destroyEach();
  fruitsGroup.destroyEach();
  score = 0;
  hunger = 0;
  }