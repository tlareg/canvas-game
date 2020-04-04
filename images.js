(function() {

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

  const images = loadImages([
    { name: 'background', src: 'imgs/background.png' },
    { name: 'hero', src: 'imgs/hero.png' },
    { name: 'enemy', src: 'imgs/enemy.png' },
    { name: 'bullet', src: 'imgs/bullet.png' }
  ])

  const game = window.game || (window.game = {})
  game.images = images

})()
