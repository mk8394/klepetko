// Create and reference video element
var vid = document.createElement('video');

// Add class for styling
vid.classList.add('playing');

// Add a src to .vid
vid.src = '../assets/HUD/StartAnim.mp4';

// Load .vid
vid.load();

vid.height = 1080;
vid.width = 1920;
vid.muted = 'muted';

vid.style.position = 'absolute';
vid.style.top = 0;
vid.style.left = 0;
vid.style.width = '1920px';
vid.style.height = '1080px';
// vid.style.position = 'absolute';

// Append the video to game div
document.getElementById('game').appendChild(vid);

// Play video
vid.play();

/* Register ended event to vid
|| After video has ended...
*/
vid.addEventListener('ended', function(e) {

  // Pause vid
  vid.pause()

  /* Reset time played. This method used
  || along with .pause() is equivelant to "stop"
  */
//   vid.currentTime = 0;

  // Simulate a `non-playing state`
  vid.classList.remove('playing');

  /* Delay the call to remove vid in order
  || to preserve the fade ouyt effect.
  */
  setTimeout(function() {
    document.getElementById('game').removeChild(vid);
  }, 500);
}, false);