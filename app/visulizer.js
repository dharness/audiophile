    var audioContent = new AudioContext();
    var audioStream = audioContent.createMediaStreamSource(stream);
    var analyser = audioContent.createAnalyser();
    audioStream.connect(analyser);
    analyser.fftSize = 1024;

    var dataArray = new Uint8Array(analyser.frequencyBinCount);
    var canvas = document.getElementById("myCanvas");
    var canvasCtx = canvas.getContext("2d");
    var WIDTH = 700;
    var HEIGHT = 200;
    var bufferLength = analyser.frequencyBinCount;


    function draw() {

          drawVisual = requestAnimationFrame(draw);

          analyser.getByteTimeDomainData(dataArray);

          canvasCtx.fillStyle = 'rgb(200, 200, 200)';
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

          canvasCtx.lineWidth = 2;
          canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

          canvasCtx.beginPath();

          var sliceWidth = WIDTH * 1.0 / bufferLength;
          var x = 0;

          for(var i = 0; i < bufferLength; i++) {
       
            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT/2;

            if(i === 0) {
              canvasCtx.moveTo(x, y);
            } else {
              canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
          }

          canvasCtx.lineTo(canvas.width, canvas.height/2);
          canvasCtx.stroke();
    };

    draw();