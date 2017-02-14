(function() {

  const game = window.game

  const {
    getRequestAnimationFrame,
    createCanvas
  } = game.utils

  const {
    isDownKeyWithFunction,
    addKeyListeners
  } = game.keys

  const { images } = game


  init()

  function init() {
    const requestAnimationFrame = getRequestAnimationFrame()
    const canvas = createCanvas()
    const ctx = canvas.getContext('2d');

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

    const enemies = [
      {
        x: 200,
        y: 0,
        speed: 100,
        image: 'enemy'
      },
      {
        x: 600,
        y: 0,
        speed: 150,
        image: 'enemy'
      }
    ]

    const gameState = {
      canvas,
      ctx,
      keysDown: {},
      score: 0,
      background,
      player,
      enemies
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
    updateEnemyPositions(modifier, gameState)
  }

  function updatePlayerPosition(modifier, gameState) {
    const { keysDown, player } = gameState
    const diff = player.speed * modifier

    if (isDownKeyWithFunction(keysDown, 'up')) player.y -= diff;
    if (isDownKeyWithFunction(keysDown, 'down')) player.y += diff;
    if (isDownKeyWithFunction(keysDown, 'left')) player.x -= diff;
    if (isDownKeyWithFunction(keysDown, 'right')) player.x += diff;
  }

  function updateEnemyPositions(modifier, gameState) {
    const { enemies, canvas } = gameState
    enemies.forEach(e => {
      const diff = e.speed * modifier
      e.y += diff
    })
    gameState.enemies = enemies.filter(e => e.y < canvas.height)
  }

  function render(gameState) {
    const {
      background,
      player,
      enemies
    } = gameState

    renderGameObj(gameState, background)
    renderGameObj(gameState, player)
    enemies.forEach(enemy => renderGameObj(gameState, enemy))
  }

  function renderGameObj(gameState, gameObj) {
    const { ctx } = gameState
    const { x, y, image } = gameObj
    const imgObj = images[image]
    imgObj.isReady && ctx.drawImage(imgObj.el, x, y);
  }

})()
