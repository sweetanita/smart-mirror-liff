window.onload = function (e) {
    var myLiffId = '1653359134-GD2RKWnj'
    // initializeApp(0 );
    // liff.init(function (data) {
    //     initializeApp(data);
    // });
    var active = false;
  var currentX;
  var currentY;
  var initialX;
  var initialY;
  var xOffset = 0;
  var yOffset = 0;

  var url_string = window.location.href
  var url = new URL(url_string);
  var nPath = url.searchParams.get("ngrok");
  var socketURL = "wss://" + nPath + ".ngrok.io?user=1"

  console.log("v1.12")

    liff
        .init({
            liffId: myLiffId
        })
        .then((data) => {
            // start to use LIFF's api
            initializeApp(data);
        })
        .catch((err) => {
            // document.getElementById("liffAppContent").classList.add('hidden');
            // document.getElementById("liffInitErrorMessage").classList.remove('hidden');
        });
    if ("WebSocket" in window) {
        var wsURL = socketURL
       // alert("WebSocket is supported by your Browser!");
       
       // Let us open a web socket
       var ws = new WebSocket(wsURL, ["liff-client"]);
        
       ws.onopen = function() {
          
          // Web Socket is connected, send data using send()
          ws.send("Connected");
          // document.getElementById('shutterbutton').style.display = "block"
          // alert("Message is sent...");
       };
        
       ws.onmessage = function (evt) { 
          var received_msg = evt.data;
          console.log(received_msg)
          if (received_msg.includes("load")) {
            alert("Uploading...");
          }
          else if (received_msg.includes(".jpg")) {
            location.href = "edit.html?p=" + received_msg;
            // location.href = "https://vos.line-scdn.net/line-town-cms-external/shots/pics/" + received_msg;
          }
       };
        
       ws.onclose = function() { 
          
          // websocket is closed.
          alert("Connection is closed..."); 
       };
           //SMART MIRROR
        // document.getElementById('shutterbutton').addEventListener('click', function () {
        //     ws.binaryType = 'arraybuffer';
        //     ws.send(new Uint8Array([55]));
        //     document.getElementById('shutterbutton').disabled = true;
        //     window.alert("Processing Image. Please wait.")
        //     document.body.style.filter = 'grayscale(1)';
        // });

            document.getElementById("frame-icon").onclick = function() {
      document.getElementById("subfooter-frame").style.display = "block"
      document.getElementById("subfooter-icon").style.display = "none"
      document.getElementById('frame-icon').src = "assets/pics/frame_icon_select.svg";
      document.getElementById('sticker-icon').src = "assets/pics/sticker_icon.svg";
    }

    document.getElementById("sticker-icon").onclick = function() {
      document.getElementById("subfooter-icon").style.display = "block"
      document.getElementById("subfooter-frame").style.display = "none"
      document.getElementById('frame-icon').src = "assets/pics/frame_icon.svg";
      document.getElementById('sticker-icon').src = "assets/pics/sticker_icon_select.svg";
    }

    document.getElementById("retake-icon").onclick = function() {
    //your code here
      ws.send("retake");
      location.href = "index.html"
    }

    document.getElementById("submit-icon").onclick = function() {
      // imgOptions = getImgOptions();
      // ws.send(imgOptions);
      var url_string = window.location.href
    var url = new URL(url_string);
    var pPath = url.searchParams.get("userPic");
    var loadImage = "https://vos.line-scdn.net/line-town-cms-external/shots/pics/" + pPath;
    liff.getProfile().then((data) => {
      let message = 'submit,'+ data.userId + ',' + loadImage
      ws.send(message);
      setTimeout(function(){
        liff.closeWindow();
      }, 1000)
    })
    

    // var loadImage = "https://vos.line-scdn.net/line-town-cms-external/shots/pics/" + pPath;
      // location.href = "share.html?userPic="+pPath;
    //your code here
    }

    document.getElementById("frame1").onclick = function() {
      addFrame(1);
      ws.send("frame1");
    }
    document.getElementById("frame2").onclick = function() {
      addFrame(2);
      ws.send("frame2");
    }
    document.getElementById("frame3").onclick = function() {
      addFrame(3);
      ws.send("frame3");
    }
    document.getElementById("frame4").onclick = function() {
      addFrame(4);
      ws.send("frame4");
    }
    document.getElementById("frame5").onclick = function() {
      addFrame(5);
      ws.send("frame5");
    }

    for(let i = 1; i < 26; i++ ) {
      document.getElementById("icon"+i).onclick = function() {
        console.log(document.getElementById("icon"+i+"-sticker").style.display)
        if (document.getElementById("icon"+i+"-sticker").style.display != "none") {
          document.getElementById("icon"+i+"-sticker").style.display = "none"
        }
        else {
          // document.getElementById("icon"+i+"-sticker").style.display = "flex"
           document.getElementById("icon"+i+"-sticker").style = "position:fixed; top: 50%;left: 50%;"
           $('#icon'+i+'-sticker').draggable()
          // document.getElementById("icon"+i+"-sticker").position = document.getElementById("userPic").position()
        }
      }
    }

    // Make the DIV element draggable:
    for(let i = 1; i < 26; i++ ) {
      $('#icon'+i+'-sticker').draggable()
      // document.getElementById("icon"+i+"-sticker").draggable();
    }


      function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
          // if present, the header is where you move the DIV from:
          document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
          // otherwise, move the DIV from anywhere inside the DIV:
          // elmnt.ontouchstart = dragMouseDown;
          elmnt.addEventListener("touchstart", dragStart, false);
          elmnt.addEventListener("touchend", dragEnd, false);
          elmnt.addEventListener("touchmove", drag, false);

          elmnt.addEventListener("mousedown", dragStart, false);
          elmnt.addEventListener("mouseup", dragEnd, false);
          elmnt.addEventListener("mousemove", drag, false);
        }

        function dragStart(e) {
          if (e.type === "touchstart") {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
          } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
          }
          var dragItem = document.querySelector(elmnt.id);
          if (e.target === dragItem) {
            active = true;
          }
        }

        function dragEnd(e) {
          initialX = currentX;
          initialY = currentY;

          active = false;
        }

        function drag(e) {
          if (active) {
          
            e.preventDefault();
          
            if (e.type === "touchmove") {
              currentX = e.touches[0].clientX - initialX;
              currentY = e.touches[0].clientY - initialY;
            } else {
              currentX = e.clientX - initialX;
              currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, dragItem);
          }
        }

        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.ontouchend = closeDragElement;
          // call a function whenever the cursor moves:
          document.ontouchmove = elementDrag;
        }

        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
          // stop moving when mouse button is released:
          document.ontouchend = null;
          document.ontouchmove = null;
        }
      }

        // document.getElementById('pingbutton').addEventListener('click', function () {
        //     ws.send("Ping");
        // });
        //==SMART MIRROR==
    } else {
      
       // The browser doesn't support WebSocket
       alert("WebSocket NOT supported by your Browser!");
    }
};

function initializeApp(data) {
  var url_string = window.location.href
  var url = new URL(url_string);
  var pPath = url.searchParams.get("userPic");
  var loadImage = "https://vos.line-scdn.net/line-town-cms-external/shots/pics/" + pPath;
  // var loadImage = "https://vos.line-scdn.net/line-town-cms-external/shots/" + pPath;
  // https://vos.line-scdn.net/line-town-cms-external/told.html

  var divLINE = document.createElement('div');
// divLINE.textContent = "Sup, y'all?";
divLINE.setAttribute('class', 'line-it-button');
divLINE.setAttribute('data-lang', 'en');
divLINE.setAttribute('data-type', 'share-c');
divLINE.setAttribute('data-ver', '3');
divLINE.setAttribute('data-url', loadImage.toString());
divLINE.setAttribute('data-color', 'default');
divLINE.setAttribute('data-size', 'large');
divLINE.setAttribute('data-count', 'false');
divLINE.style.width = "10%";
divLINE.style.height = "10%";
divLINE.style.display = "none";

// document.body.appendChild(divLINE);


var divFBroot = document.createElement('div');
divFBroot.setAttribute('id', 'fb-root');

var divFB = document.createElement('div');
// divFB.textContent = "Share";
divFB.setAttribute('class', 'fb-share-button');
divFB.setAttribute('data-href', loadImage);
divFB.setAttribute('data-layout', 'button');
divFB.setAttribute('data-size', 'large');

var aFB = document.createElement('a');
aFB.textContent = "Share";
aFB.setAttribute('target', '_blank');
aFB.setAttribute('href', loadImage);
aFB.setAttribute('class', 'fb-xfbml-parse-ignore');
divFB.appendChild(aFB);
// document.body.appendChild(divFBroot);
// document.body.appendChild(divFB);

   // document.getElementById('fbShare').href = "https://www.facebook.com/sharer/sharer.php?src=sdkpreparse&amp;u=" + loadImage
   // document.getElementById('fbShare').setAttribute("data-href", loadImage)
   // document.getElementById('lineShare').setAttribute("data-url", loadImage)
  console.log(loadImage)
    document.getElementById('userPic').src = loadImage;
    LineIt.loadButton();



    // openWindow call
    document.getElementById('openwindowbutton').addEventListener('click', function () {
        liff.openWindow({
            url: 'https://line.me'
        });
    });

    // closeWindow call
    document.getElementById('closewindowbutton').addEventListener('click', function () {
        liff.closeWindow();
    });

    // sendMessages call
    document.getElementById('sendmessagebutton').addEventListener('click', function () {
        liff.sendMessages([{
            type: 'text',
            text: "You've successfully sent a message! Hooray!"
        }, {
            type: 'sticker',
            packageId: '2',
            stickerId: '144'
        }]).then(function () {
            window.alert("Message sent");
        }).catch(function (error) {
            window.alert("Error sending message: " + error);
        });
    });

    // get access token
    document.getElementById('getaccesstoken').addEventListener('click', function () {
        const accessToken = liff.getAccessToken();
        document.getElementById('accesstokenfield').textContent = accessToken;
        toggleAccessToken();
    });

    // get profile call
    document.getElementById('getprofilebutton').addEventListener('click', function () {
        liff.getProfile().then(function (profile) {
            document.getElementById('useridprofilefield').textContent = profile.userId;
            document.getElementById('displaynamefield').textContent = profile.displayName;

            const profilePictureDiv = document.getElementById('profilepicturediv');
            if (profilePictureDiv.firstElementChild) {
                profilePictureDiv.removeChild(profilePictureDiv.firstElementChild);
            }
            const img = document.createElement('img');
            img.src = profile.pictureUrl;
            img.alt = "Profile Picture";
            profilePictureDiv.appendChild(img);

            document.getElementById('statusmessagefield').textContent = profile.statusMessage;
            toggleProfileData();
        }).catch(function (error) {
            window.alert("Error getting profile: " + error);
        });
    });
}

function addFrame(frame_no) {
  window.frameno = frame_no
    document.getElementById("framePic").src = "assets/pics/frame"+frame_no+"-head.png"
}

function toggleAccessToken() {
    toggleElement('accesstokendata');
}

function toggleProfileData() {
    toggleElement('profileinfo');
}

function toggleElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
        elem.style.display = "none";
    } else {
        elem.style.display = "block";
    }
}
