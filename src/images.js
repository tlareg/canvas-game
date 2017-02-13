(function() {

  const game = window.game || (window.game = {})
  game.images = {
    loadImages
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

})()
