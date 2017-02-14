(function() {

  const game = window.game || (window.game = {})

  const {
    getRequestAnimationFrame,
    createCanvas
  } = game.utils

  const {
    isDownKeyWithFunction,
    addKeyListeners
  } = game.keys

  const {
    loadImages
  } = game.images


  init()

  function init() {
    const requestAnimationFrame = getRequestAnimationFrame()

    const canvas = createCanvas()
    const ctx = canvas.getContext('2d');

    const images = loadImages([
      { name: 'background', src: 'imgs/background.png' },
      { name: 'hero', src: 'imgs/hero.png' },
      { name: 'enemy', src: 'imgs/enemy.png' },
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

})()
