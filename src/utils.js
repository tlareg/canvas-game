(function() {

  const game = window.game || (window.game = {})
  game.utils = {
    createCanvas,
    getRequestAnimationFrame
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
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);
    return canvas
  }

})()

