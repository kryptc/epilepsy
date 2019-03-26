// / <reference path="webgl.d.ts" />

var cubeRotation = 0.0;


//
// Start here
//

var c, popo;
var ct, ppt;
var r1, r2, r3, t1, t2, t3;
var w1, w2, wt1, wt2;
var g;
var trainarr= [];
var blockarr= [];
var coinarr = [];
var busharr = [];
var flying1, flying2, jumping, zoomin;
var arrowobj;
var doggo;

var trainbb = [];
var blockbb = [];
var coinbb = [];
var bushbb = [];
var f1bb, f2bb, jbb, zbb;

var blocktextarr = [];
var traindoorarr = [];
var trainsidearr = [];

timer = 800;
jumpflag = 0;
flyflag = 0;
zflag = 0;
score = 0;
graytime = 600;
grayflag = 0;
slowtimer = 500;
flash = 0;
transition = 0;
ducktime = 5;

main();


var move = 0;
function main() 
{

  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  xarr = [2.5, 0, -2.5];

  c = new player(gl, [0, -0.2, -0.0]);
  c.slow = 1;
  ct = new playertext(gl, [0,-0.2, 0.0]);
  popo = new policeman(gl, [0, -0.2, -1.0]);
  ppt = new popotext(gl, [0, -0.2, -1.0]);
  doggo = new dog(gl, [0.5, -0.2, -1.0]);

  flying1 = new flyingboost(gl, [xarr[parseInt(((Math.random()*10)%3))], -0.4, 250]);
  f1bb = flying1.def_bounding_box();
  flying2 = new flyingboost(gl, [xarr[parseInt(((Math.random()*10)%3))], -0.4, 2250]);
  f2bb = flying2.def_bounding_box();
  jumping = new jumpingboots(gl,[xarr[parseInt(((Math.random()*10)%3))], -0.4, 1050]);
  jbb = jumping.def_bounding_box();
  zoomin = new zoom(gl,[xarr[parseInt(((Math.random()*10)%3))], -0.4, 1450]);
  zbb = zoomin.def_bounding_box();

  // c1 = new cube(gl, [0.5, 0.0, -20.0]);
  r1 = new road(gl, [0, -1.1, 0.0]);
  r2 = new road(gl, [2.5, -1.1, 0.0]);
  r3 = new road(gl, [-2.5, -1.1, 0.0]);
  t1 = new roadtext(gl, [0, -1.1, 0.0]);
  t2 = new roadtext(gl, [2.5, -1.1, 0.0]);
  t3 = new roadtext(gl, [-2.5, -1.1, 0.0]);
  g = new ground(gl, [0, -1.1, 0.0]);
  w1 = new wall(gl, [6.0, 0, 0]);
  w2 = new wall(gl, [-6.0, 0, 0]);
  wt1 = new walltext(gl, [6.0, 0, 0]);
  wt2 = new walltext(gl, [-6.0, 0, 0]);
  arrowobj = new arrow(gl, [0,0,4000]);

  for (var i = 0; i <= 25; i++) 
  {
    var x = xarr[parseInt(((Math.random()*10)%3))];
    var y = 0.0;
    var z = Math.random()*10000%5000 + 100;
    var t = new train(gl, [x,y,z]);
    var td = new traindoortext(gl, [x,y,z]);
    var ts = new trainsidetext(gl, [x,y,z]);
    t.move = 0;
    if (i%3 == 0)
    {
      t.move = 1;
    }
    if (i%5==0)
    {
      t.move = 2;
    }
    temp = t.def_bounding_box();
    trainbb.push(temp);
    // console.log(t);
    trainarr.push(t);
    traindoorarr.push(td);
    trainsidearr.push(ts);
  }
  for (var i = 0; i <= 40; i++) 
  {
    var x = xarr[parseInt(((Math.random()*10)%3))];
    var y = -0.6;
    var z = Math.random()*10000%5000 + 20;
    var b = new block(gl, [x,y,z]);
    var btext = new roadblocktext(gl, [x,y,z]);
    // console.log(b);
    temp = b.def_bounding_box();
    blockbb.push(temp);
    blockarr.push(b);
    blocktextarr.push(btext);
  }
  for (var i = 0; i <= 40; i++) 
  {
    var x = (Math.random()*10)%10 - 5;
    var y = -0.6;
    var z = Math.random()*10000%5000 + 20;
    var b = new bush(gl, [x,y,z]);
    // console.log(b);
    temp = b.def_bounding_box();
    bushbb.push(temp);
    busharr.push(b);
  }
  for (var i = 0; i <= 200; i++) 
  {
    var b = new coin(gl, [xarr[parseInt(((Math.random()*10)%3))], -0.4, Math.random()*10000%5000]);
    // console.log(b);
    temp = b.def_bounding_box();
    coinbb.push(temp);
    coinarr.push(b);
  }
  // t1 = new train(gl, [0, 0, 60]);

  // If we don't have a GL context, give up now


  if (!gl) 
  {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };


/* shaders without lighting

  const vsTxtSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

  const fsTxtSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;
  */

  //shaders with lighting

    const vsTxtSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.65,0.65,0.65);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.0, 1.8, 0.0));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

  const fsTxtSourceLit = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
      highp vec3 Image = vec3(texelColor.r+0.4,texelColor.g+0.4,texelColor.b+0.4);

      gl_FragColor = vec4(Image * vLighting, texelColor.a);
    }
  `;

  const fsTxtSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;
    uniform sampler2D uSampler;
    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
      highp vec3 Image = vec3(texelColor.r,texelColor.g,texelColor.b);

      gl_FragColor = vec4(Image * vLighting, texelColor.a);

    }
  `;

  const shaderTxtProgram = initShaderProgram(gl, vsTxtSource, fsTxtSource);

  const programTxtInfo = {
    program: shaderTxtProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderTxtProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderTxtProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderTxtProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderTxtProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderTxtProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderTxtProgram, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderTxtProgram, 'uSampler'),
    },
  };

  const shaderTxtProgramLit = initShaderProgram(gl, vsTxtSource, fsTxtSourceLit);

  const programTxtInfoLit = {
    program: shaderTxtProgramLit,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderTxtProgramLit, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderTxtProgramLit, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderTxtProgramLit, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderTxtProgramLit, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderTxtProgramLit, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderTxtProgramLit, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderTxtProgramLit, 'uSampler'),
    },
  };


  //for grayscale rendering

  const gray_fsSource = `
    precision mediump float;
    varying lowp vec4 vColor;

    void main(void) {
      float gray = dot(vec3(vColor[0], vColor[1], vColor[2]), vec3(0.299, 0.587, 0.114));
      gl_FragColor = vec4(vec3(gray), 1.0);
    }
  `;

  const grayfsTxtSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;
    precision mediump float;

    void main(void) {
      vec4 color = texture2D(uSampler, vTextureCoord);
      float gray = dot(vec3(color[0], color[1], color[2]), vec3(0.299, 0.587, 0.114));
      gl_FragColor = vec4(vec3(gray), 1.0);
    }
  `;

  const shaderProgramWithoutTextureGrayScale = initShaderProgram(gl, vsSource, gray_fsSource);

  const programInfoGrey = {
    program: shaderProgramWithoutTextureGrayScale,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgramWithoutTextureGrayScale, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgramWithoutTextureGrayScale, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgramWithoutTextureGrayScale, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgramWithoutTextureGrayScale, 'uModelViewMatrix'),
    },
  };

  const shaderProgramGrayScale = initShaderProgram(gl, vsTxtSource, grayfsTxtSource);

  const programInfoTextureGreyScale = {
    program: shaderProgramGrayScale,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgramGrayScale, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgramGrayScale, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgramGrayScale, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgramGrayScale, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

  

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  //const buffers = initBuffers(gl);

  const grasstxt = loadTexture(gl, "img/grass.jpg");
  const brickstxt = loadTexture(gl, "img/bricks.jpg");
  const blocktxt = loadTexture(gl, "img/roadblock.jpg");
  const traindoortxt = loadTexture(gl, "img/traindoor.jpeg");
  const traintxt = loadTexture(gl, "img/train.jpeg");
  const tracktxt = loadTexture(gl, "img/tracks.jpg");
  const playertxt = loadTexture(gl, "img/player.jpg");
  const popotxt = loadTexture(gl, "img/policeman.jpg");
  const bushtxt = loadTexture(gl, "img/bush.jpg");
  const dogtxt = loadTexture(gl, "img/dogback.jpg");

  var then = 0;

  // Draw the scene repeatedly
  function render(now) 
  {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    flash += 1;
    if (grayflag) 
    {
      drawScene(gl, programInfoGrey, deltaTime, programInfoTextureGreyScale, programInfoGrey, grasstxt, brickstxt, blocktxt, traindoortxt, traintxt, tracktxt, playertxt, popotxt, bushtxt, dogtxt);
    }
    else 
    {
      drawScene(gl, programInfo, deltaTime, programTxtInfo, programTxtInfoLit, grasstxt, brickstxt, blocktxt, traindoortxt, traintxt, tracktxt, playertxt, popotxt, bushtxt, dogtxt);
    }
    checkInput(gl);
    tickelements();
    // sleep(1);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, deltaTime, programTxtInfo, programTxtInfoLit, grasstxt, brickstxt, blocktxt, traindoortxt, traintxt, tracktxt, playertxt, popotxt, bushtxt, dogtxt) 
{
  gl.clearColor(113/255, 185/255, 226/255, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 400.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
    var cameraMatrix = mat4.create();
    mat4.translate(cameraMatrix, cameraMatrix, [0, c.pos[1] + 3, c.pos[2]-8]);
    var cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];

    var up = [0, 1, 0];

    mat4.lookAt(cameraMatrix, cameraPosition, [0, c.pos[1] + 2, c.pos[2] - 1], up);

    var viewMatrix = cameraMatrix;//mat4.create();

    //mat4.invert(viewMatrix, cameraMatrix);

    var viewProjectionMatrix = mat4.create();

    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

  c.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  popo.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);

  flying1.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  flying2.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  jumping.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  zoomin.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);

  r1.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  r2.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  r3.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  w1.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  w2.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  arrowobj.drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);

  for (var i = trainarr.length - 1; i >= 0; i--) 
  {
    trainarr[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    traindoorarr[i].draw(gl, viewProjectionMatrix, programTxtInfo, deltaTime, traindoortxt);
    trainsidearr[i].draw(gl, viewProjectionMatrix, programTxtInfo, deltaTime, traintxt);

  }
  for (var i = blockarr.length - 1; i >= 0; i--) 
  {
    blockarr[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    blocktextarr[i].draw(gl, viewProjectionMatrix, programTxtInfo, deltaTime, blocktxt);
  }
  for (var i = busharr.length - 1; i >= 0; i--) 
  {
    // busharr[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
    busharr[i].draw(gl, viewProjectionMatrix, programTxtInfo, deltaTime, bushtxt);
  }
  for (var i = coinarr.length - 1; i >= 0; i--) 
  {
    coinarr[i].drawCube(gl, viewProjectionMatrix, programInfo, deltaTime);
  }

  // c.draw(gl, viewProjectionMatrix, programTxtInfo, deltaTime);
  t1.draw(gl, viewProjectionMatrix, programTxtInfo, deltaTime, tracktxt);
  t2.draw(gl, viewProjectionMatrix, programTxtInfo, deltaTime, tracktxt);
  t3.draw(gl, viewProjectionMatrix, programTxtInfo, deltaTime, tracktxt);
  if (flash > 100)
  {
    wt1.draw(gl, viewProjectionMatrix, programTxtInfoLit, deltaTime, brickstxt);
    wt2.draw(gl, viewProjectionMatrix, programTxtInfoLit, deltaTime, brickstxt);
    if (flash > 120)
    {
      flash = 0;
    }
  }
  else
  {
    wt1.draw(gl, viewProjectionMatrix, programTxtInfo, deltaTime, brickstxt);
    wt2.draw(gl, viewProjectionMatrix, programTxtInfo, deltaTime, brickstxt);
  }
 
  g.draw(gl, viewProjectionMatrix, programTxtInfo, deltaTime, grasstxt);
  ct.draw(gl, viewProjectionMatrix, programTxtInfo, deltaTime, playertxt);
  ppt.draw(gl, viewProjectionMatrix, programTxtInfo, deltaTime, popotxt);
  doggo.draw(gl, viewProjectionMatrix, programTxtInfo, deltaTime, dogtxt);

}

var i = 200;
moveleft = 0;
moveright = 0;

function checkInput(gl)
{
    document.addEventListener('keydown', function(event) {
    if (event.code == 'ArrowRight' && transition == 0) 
    {
        transition = 1;
        moveright = 1;
    }
    else if (event.code == 'ArrowLeft' && transition == 0)
    {
        transition = 1;
        moveleft = 1; //2.5
    }
    else if (event.code == 'ArrowDown')
    {
      c.duck = 1;
      console.log("ducking");
    }
    else if (event.code == 'Space')
    {
      // move = -0.01;
      c.pos[0] = c.pos[0];
      c.pos[1] = c.pos[1];
      c.pos[2] = c.pos[2];
      c.jump = 1;
    }
    else if (event.code == 'KeyQ' || event.code == 'Escape')
    {
      // Application.Quit();
      // gl.clearColor(0.0, 0.0, 0.0, 1.0); 
      alert('Game Over. Leave now! Score: '+ score); 
    }
    else if (event.code == 'KeyG')
    {
      grayflag = 1;
    }
  });
    document.getElementById("score").innerHTML = score;
}

function tickelements()
{
  ct.pos = c.pos;
  ppt.pos = popo.pos;
  doggo.pos[0] = popo.pos[0]+0.5;
  doggo.pos[1] = popo.pos[1];
  doggo.pos[2] = popo.pos[2];

  var i = 0;
  if (timer <= 0)
  {
    flyflag = 0;
    jumpflag = 0;
    zflag = 0;
    timer = 800;
  }
  if (grayflag)
  {
    graytime -= 1;
    if (graytime <= 0)
    {
      grayflag = 0;
      graytime = 600;
    }
  }

  if (moveleft)
  {
    if (c.pos[0] >= 0.0)
    {
      c.pos[0] += 0.2;
      transition = 1;
      if (c.pos[0] >= 2.5)
      {
        c.pos[0] = 2.5;
        transition = 0;
        moveleft = 0;
      }
    }
    else if (c.pos[0] >= -2.5)
    {
      c.pos[0] += 0.2;
      transition = 1;
      if (c.pos[0] >= 0.0)
      {
        c.pos[0] = 0.0;
        transition = 0;
        moveleft = 0;
      }
    }
  }
  else if (moveright)
  {
    if (c.pos[0] <= 0.0)
    {
      c.pos[0] -= 0.2;
      transition = 1;
      if (c.pos[0] <= -2.5)
      {
        c.pos[0] = -2.5;
        transition = 0;
        moveright = 0;
      }

    }
    else if (c.pos[0] <= 2.5)
    {
      c.pos[0] -= 0.2;
      transition = 1;
      if (c.pos[0] <= 0.0)
      {
        c.pos[0] = 0.0;
        transition = 0;
        moveright = 0;
      }
    }
  }
    
  //ducking
  if (c.duck)
  {
    c.rotation = 90;
    ct.rotation = 90;
    ducktime-=1;
    if (ducktime <= 0)
    {
      c.duck = 0;
      ducktime = 30;
      c.rotation = 0;
      ct.rotation = 0;
    }
  }

  //flying high
  if (flyflag) 
  {
    if (c.pos[1] < 4.0)
    {
      c.pos[1] += 0.2;
    }
    timer -= 1;
  }

  //speeding up
  if (zflag)
  {
    c.pos[2] += 1.5;
  }
  else 
  {
    if (c.slow > 0)
    {
      c.pos[2] += 0.45;
      popo.pos[2] = c.pos[2] - 2.5;
      popo.pos[0] = c.pos[0];
      slowtimer -= 1;
      if (slowtimer <= 0)
      {
        slowtimer = 500;
        c.slow = 0;
      }
    }
    else
    {
      c.pos[2] += 0.55;
      popo.pos[2] = c.pos[2] - 4;
      popo.pos[0] = c.pos[0];
    }
  }

  if (!flyflag)
  {
    if (c.jump == 1)
    {
      c.pos[1] += 0.1;
      i+=1;
      // console.log(i);
    }
    else if (c.pos[1] > -0.2 && c.train == 0)
    {
      c.pos[1] -= 0.08;
      console.log("comin down");
    }    
  }
  

  var maxht = 2.2;
  if (jumpflag)
  {
    console.log("high boots");
    maxht = 4.2;
    timer-=1;
  }
  if (c.pos[1] >= maxht)
  {
    c.jump = 0;
    console.log(maxht);
  }

  cbb = c.def_bounding_box();
  pbb = popo.def_bounding_box();

  for (var i = 0; i < coinbb.length; i++) 
  {
    if (detect_collision(cbb, coinbb[i]))
    {
      score += 5;
      coinbb.splice(i,1);
      coinarr.splice(i,1);
    }
  }
  for (var i = 0; i < blockbb.length; i++) 
  {
    if (detect_collision(cbb, blockbb[i]) || detect_collision(cbb, bushbb[i]))
    {
      c.slow += 1;
      console.log("Ouch", c.slow);
      c.pos[2] += 1.2;
      if (c.slow > 1)
      {
        popo.pos[2] = c.pos[2] + 0.2;
        alert('Game Over. Caught by the cop. Leave now! Score: '+ score); 
      }
    }
  }

  for (var i = 0; i < trainbb.length; i++) 
  {
    if (trainarr[i].move == 1)
    {
      trainarr[i].pos[2] += 0.7;
      trainsidearr[i].pos[2] += 0.7;
      traindoorarr[i].pos[2] += 0.7;
      trainbb[i] = trainarr[i].def_bounding_box();
    }
    else if (trainarr[i].move == 2)
    {
      trainarr[i].pos[2] -= 0.7;
      trainsidearr[i].pos[2] -= 0.7;
      traindoorarr[i].pos[2] -= 0.7;
      trainbb[i] = trainarr[i].def_bounding_box();
    } 
    if (detect_collision(cbb, trainbb[i]))
    {
      //death
      if (c.pos[1] < 1.6)
      {
        alert('Game Over. Dead. Leave now! Score: '+ score); 
        c.pos = [0,0,0];  
      }
      else
      {
        console.log("walkontren");
        c.pos[1] = 2.0;
        c.train = 1;
      }
      
    }
    else 
    {
      c.train = 0;
    }
  }

  //powerup detection
  if (detect_collision(cbb, jbb))
  {
    jumpflag = 1;
    jumping.pos[1] = -100;
    timer = 800;
  }
  if (detect_collision(cbb, f1bb))
  {
    flyflag = 1;
    flying1.pos[1] = -100;
    timer = 800;
  }
  if (detect_collision(cbb, f2bb))
  {
    flyflag = 1;
    flying2.pos[1] = -100;
    timer = 800;
  }
  if (detect_collision(cbb, zbb))
  {
    zflag = 1;
    zoomin.pos[1] = -100;
    timer = 800;
  }

  //finish game
  if (c.pos[2] > 4000)
  {
    alert('Game Over. You won! Score: '+ score); 
    c.pos = [0,0,0];  
  }
}

function detect_collision(a, b) 
{
    return (Math.abs(a.x - b.x) * 2 < (a.wd + b.wd)) &&
           (Math.abs(a.y - b.y) * 2 < (a.ht + b.ht)) &&
           (Math.abs(a.z - b.z) * 2 < (a.depth + b.depth));
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function sleep(milliseconds) 
{
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) 
  {
    if ((new Date().getTime() - start) > milliseconds)
    {
      break;
    }
  }
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn off mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}