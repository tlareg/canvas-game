(function() {

  const game = window.game

  const {
    getRequestAnimationFrame,
    createCanvas,
    getRandomInt,
    rectsCollide
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

    const gameState = {
      canvas,
      ctx,
      keysDown: {},
      end: false,
      score: 0,
      background,
      player: createPlayer({ canvas }),
      enemies: []
    }

    addKeyListeners(gameState)

    let then = Date.now()
    const loop = () => {
      const now = Date.now()
      const delta = now - then
      const modifier = delta / 1000

      update(modifier, gameState)
      render(gameState)

      if (gameState.end) {
        return
      }

      then = now
      requestAnimationFrame(loop)
    }

    loop()
  }

  function update(modifier, gameState) {
    createEnemies(gameState)
    updatePlayerPosition(modifier, gameState)
    updateEnemyPositions(modifier, gameState)
    checkCollisions(gameState)
  }

  function createPlayer({ canvas }) {
    return {
      x: canvas.width / 2,
      y: canvas.height / 2,
      width: 32,
      height: 32,
      speed: 256,
      image: 'hero'
    }
  }

  function createEnemies(gameState) {
    const {
      canvas,
      enemies
    } = gameState

    while(enemies.length < 25) {
      enemies.push(createEnemy({ canvas }))
    }
  }

  function createEnemy({ canvas }) {
    return {
      x: getRandomInt(0, canvas.width),
      y: 0,
      width: 32,
      height: 32,
      speed: getRandomInt(150, 250),
      image: 'enemy'
    }
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
      e.x += getRandomInt(-diff, diff)
    })
    gameState.enemies = enemies.filter(enemy => isGameObjOnMap(canvas, enemy))
  }

  function isGameObjOnMap({ width: mapWidth, height: mapHeight }, { x, y }) {
    return (
      y < mapHeight &&
      x < mapWidth &&
      y > 0 &&
      x > 0
    )
  }

  function checkCollisions(gameState) {
    const { player, enemies } = gameState

    for (let i = 0; i < enemies.length; i++) {
      if (rectsCollide(player, enemies[i])) {
        gameState.end = true
      }
    }
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

    if (gameState.end) {
      renderGameOver(gameState)
    }
  }

  function renderGameObj(gameState, gameObj) {
    const { ctx } = gameState
    const { x, y, image } = gameObj
    const imgObj = images[image]
    imgObj.isReady && ctx.drawImage(imgObj.el, x, y);
  }

  function renderGameOver(gameState) {
    const { ctx } = gameState
    ctx.fillStyle = 'rgb(250, 0, 0)';
	  ctx.font = '100px Helvetica';
	  ctx.textAlign = 'left';
	  ctx.textBaseline = 'top';
	  ctx.fillText('GAME OVER', 100, 100);
  }

})()
