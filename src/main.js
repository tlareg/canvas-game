const keyNameToKeyCodeMap = {
  'upArrow': 38,
  'downArrow': 40,
  'rightArrow': 39,
  'leftArrow': 37,
  'k': 75,
  'j': 74,
  'l': 76,
  'h': 72,
  'w': 87,
  's': 83,
  'a': 65,
  'd': 68
}

const keyFunctionToKeyNameMap = {
  up: ['upArrow', 'w', 'k'],
  down: ['downArrow', 's', 'j'],
  right: ['rightArrow', 'd', 'l'],
  left: ['leftArrow', 'a', 'h']
}

function isDownKeyWithFunction(keysDown, fnName) {
  return keyFunctionToKeyNameMap[fnName].some(keyName => {
    const keyCode = keyNameToKeyCodeMap[keyName]
    return !!keysDown[keyCode]
  })
}

function addKeyListeners(gameState) {
  const { keysDown } = gameState
  window.addEventListener('keydown', e => keysDown[e.keyCode] = true)
  window.addEventListener('keyup', e => delete keysDown[e.keyCode])
}


init()

function init() {
  const requestAnimationFrame = getRequestAnimationFrame()

  const canvas = createCanvas()
  const ctx = canvas.getContext('2d');

  const images = loadImages([
    { name: 'background', src: 'imgs/background.png' },
    { name: 'hero', src: 'imgs/hero.png' },
    { name: 'monster', src: 'imgs/monster.png' },
  ])

  const background = {
    x: 0,
    y: 0,
    image: 'background'
  }

  const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speed: 256,
    image: 'hero'
  }

  const gameState = {
    canvas,
    ctx,
    images,
    keysDown: {},
    score: 0,
    background,
    player
  }

  addKeyListeners(gameState)

  let then = Date.now()
  const loop = () => {
    const now = Date.now()
    const delta = now - then
    const modifier = delta / 1000

    update(modifier, gameState)
    render(gameState)

    then = now
    requestAnimationFrame(loop)
  }

  loop()
}

function getRequestAnimationFrame() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.mozRequestAnimationFrame
  )
}

function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 480;
  document.body.appendChild(canvas);
  return canvas
}

function loadImages(imgList) {
  return imgList.reduce((acc, { name, src }) => {
    acc[name] = loadImage(name, src)
    return acc
  }, {})
}

function loadImage(name, src) {
  const imgObj = {
    name,
    isReady: false,
    el: new Image()
  }
  imgObj.el.onload = () => imgObj.isReady = true
  imgObj.el.src = src
  return imgObj
}


function update(modifier, gameState) {
  updatePlayerPosition(modifier, gameState)
}

function updatePlayerPosition(modifier, gameState) {
  const { keysDown, player } = gameState
  const diff = player.speed * modifier

  if (isDownKeyWithFunction(keysDown, 'up')) {
    player.y -= diff
  }
  if (isDownKeyWithFunction(keysDown, 'down')) {
    player.y += diff
  }
  if (isDownKeyWithFunction(keysDown, 'left')) {
    player.x -= diff
  }
  if (isDownKeyWithFunction(keysDown, 'right')) {
    player.x += diff
  }
}


function render(gameState) {
  const { background, player } = gameState
  renderGameObj(gameState, background)
  renderGameObj(gameState, player)
}

function renderGameObj(gameState, gameObj) {
  const { ctx, images } = gameState
  const { x, y, image } = gameObj
  const imgObj = images[image]
  imgObj.isReady && ctx.drawImage(imgObj.el, x, y);
}
