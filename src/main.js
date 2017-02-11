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

  const gameState = {
    canvas,
    ctx,
    images,
    keysDown: {},
    score: 0,
    hero: {
      speed: 256,
      x: canvas.width / 2,
      y: canvas.height / 2
    },
    monster: {},
  }

  addKeyListeners(gameState)

  let then = Date.now()
  const loop = () => {
    const now = Date.now()
    const delta = now - then

    update(delta / 1000, gameState)
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

function addKeyListeners(gameState) {
  const { keysDown } = gameState
  window.addEventListener('keydown', e => keysDown[e.keyCode] = true)
  window.addEventListener('keyup', e => delete keysDown[e.keyCode])
}

function update(modifier, gameState) {
  const { hero, keysDown } = gameState

  if (keysDown[38]) {
    hero.y -= hero.speed * modifier
  }
  if (keysDown[40]) {
    hero.y += hero.speed * modifier
  }
  if (keysDown[37]) {
    hero.x -= hero.speed * modifier
  }
  if (keysDown[39]) {
    hero.x += hero.speed * modifier
  }
}

function render(gameState) {
  const {
    canvas,
    ctx,
    images,
    hero
  } = gameState

  const bgImg = images['background']
  bgImg.isReady && ctx.drawImage(bgImg.el, 0, 0);

  const heroImg = images['hero']
  heroImg.isReady && ctx.drawImage(heroImg.el, hero.x, hero.y);
}

