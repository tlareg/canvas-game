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
    addKeyListeners,
    keyNameToKeyCodeMap
  } = game.keys

  const { images } = game

  const requestAnimationFrame = getRequestAnimationFrame()

  const canvas = createCanvas()
  document.querySelector('.canvas-container').appendChild(canvas)

  const ctx = canvas.getContext('2d');

  const gameState = {
    canvas,
    ctx,
    background: createBackground(),
    keysDown: {}
  }

  addKeyListeners(gameState)

  document.querySelector('.main-menu__new-game')
    .addEventListener('click', () => newGame(gameState))

  window.addEventListener('keydown', e => {
    if (e.keyCode === keyNameToKeyCodeMap.n) {
      newGame(gameState)
    }
  })


  function newGame(gameState) {
    showCanvasContainer()
    resetGameState(gameState)

    let then = Date.now()
    const loop = () => {
      const now = Date.now()
      const delta = now - then
      gameState.modifier = delta / 1000

      update(gameState)
      render(gameState)

      if (gameState.end) {
        return
      }

      then = now
      requestAnimationFrame(loop)
    }

    loop()
  }

  function showCanvasContainer() {
    document.querySelector('.canvas-container').style.display = 'block'
  }

  function resetGameState(gameState) {
    Object.assign(gameState, {
      end: false,
      modifier: 1,
      score: 0,
      player: createPlayer(gameState),
      enemies: [],
      bullets: []
    })

    Object.keys(gameState.keysDown)
      .forEach(prop => gameState.keysDown[prop] = false)
  }

  function createBackground() {
    return { x: 0, y: 0, image: 'background' }
  }

  function createPlayer(gameState) {
    const { canvas } = gameState
    return {
      x: canvas.width / 2,
      y: canvas.height / 2,
      width: 32,
      height: 32,
      speed: 300,
      image: 'hero',
      shootRate: 80, // time between bullets in ms
      lastShootTime: 0
    }
  }

  function createBullet({ x, y }) {
    return {
      x,
      y,
      width: 10,
      height: 10,
      speed: 600,
      image: 'bullet'
    }
  }

  function createEnemies(gameState) {
    const {
      canvas,
      enemies
    } = gameState

    while(enemies.length < 50) {
      enemies.push(createEnemy({ canvas }))
    }
  }

  function createEnemy({ canvas }) {
    return {
      x: getRandomInt(0, canvas.width),
      y: 0,
      width: 32,
      height: 32,
      speed: getRandomInt(80, 200),
      image: 'enemy'
    }
  }

  function update(gameState) {
    updatePlayer(gameState)
    updateBullets(gameState)
    updateEnemies(gameState)
    checkCollisions(gameState)
  }

  function updatePlayer(gameState) {
    const { keysDown, player, modifier, canvas } = gameState
    const diff = player.speed * modifier
    const dirs = ['up', 'down', 'left', 'right']

    dirs.forEach(dir => {
      if (!isDownKeyWithFunction(keysDown, dir)) return;

      const { x: newX, y: newY } = computeNewCoords(dir, diff, player)

      const areValidNewCoords = isGameObjOnMap(canvas, {
        width: player.width,
        height: player.height,
        x: newX,
        y: newY
      })

      if (areValidNewCoords) {
        player.y = newY
        player.x = newX
      }
    })
  }

  function computeNewCoords(dir, diff, { x, y }) {
    if (dir === 'up')  return { x, y: y - diff }
    if (dir === 'down')  return { x, y: y + diff }
    if (dir === 'left')  return { x: x - diff, y }
    if (dir === 'right')  return { x: x + diff, y }
  }

  function updateEnemies(gameState) {
    const { modifier, enemies, canvas } = gameState

    createEnemies(gameState)

    enemies.forEach(e => {
      const diff = e.speed * modifier
      e.y += diff
      e.x += getRandomInt(-diff, diff)
    })

    gameState.enemies = enemies.filter(enemy => isGameObjOnMap(canvas, enemy))
  }

  function updateBullets(gameState) {
    const { modifier, keysDown, player, bullets, canvas } = gameState

    bullets.forEach(bullet => {
      const diff = bullet.speed * modifier
      bullet.y -= diff
    })

    const canFire = () => {
      if (!player.lastShootTime) return true
      return (Date.now() - player.lastShootTime) >= player.shootRate
    }

    if (isDownKeyWithFunction(keysDown, 'fire') && canFire()) {
      player.lastShootTime = Date.now()
      bullets.push(createBullet({
        x: player.x,
        y: player.y
      }))
    }

    gameState.bullets = bullets.filter(bullet => isGameObjOnMap(canvas, bullet))
  }

  function isGameObjOnMap(
    { width: mapWidth, height: mapHeight },
    { x, y, width, height }
  ) {
    return (
      y + height < mapHeight &&
      x + width < mapWidth &&
      y > 0 &&
      x > 0
    )
  }

  function checkCollisions(gameState) {
    const { player, bullets, enemies } = gameState

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i]

      for (let j = 0; j < bullets.length; j++) {
        const bullet = bullets[j]

        if (rectsCollide(enemy, bullet)) {
          enemy.toRemove = true
          bullet.toRemove = true
          gameState.score += 1
          break
        }
      }

      if (enemy.toRemove) break

      if (rectsCollide(player, enemy)) {
        gameState.end = true
        break
      }
    }

    gameState.enemies = enemies.filter(enemy => !enemy.toRemove)
    gameState.bullets = bullets.filter(bullet => !bullet.toRemove)
  }

  function render(gameState) {
    const {
      background,
      player,
      bullets,
      enemies
    } = gameState

    renderGameObj(gameState, background)
    renderGameObj(gameState, player)
    bullets.forEach(bullet => renderGameObj(gameState, bullet))
    enemies.forEach(enemy => renderGameObj(gameState, enemy))

    renderInfo(gameState)

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

  function renderInfo(gameState) {
    const { ctx, score } = gameState
    ctx.fillStyle = 'rgb(0, 0, 0)'
	  ctx.font = '24px Helvetica'
	  ctx.textAlign = 'left'
	  ctx.textBaseline = 'top'
	  ctx.fillText(`SCORE: ${score}`, 10, 10)
  }

  function renderGameOver(gameState) {
    const { ctx } = gameState
    ctx.fillStyle = 'rgb(255, 150, 46)'
	  ctx.font = '100px Helvetica'
	  ctx.textAlign = 'left'
	  ctx.textBaseline = 'top'
	  ctx.fillText('GAME OVER', 100, 20)
  }

})()
