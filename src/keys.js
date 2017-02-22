(function() {

  const keyNameToKeyCodeMap = {
    'n': 78,
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

  const game = window.game || (window.game = {})
  game.keys = {
    isDownKeyWithFunction,
    addKeyListeners,
    keyNameToKeyCodeMap
  }

})()
