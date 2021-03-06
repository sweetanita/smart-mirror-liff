window.onload = function (e) {
    var myLiffId = '1653359134-GD2RKWnj'
    // initializeApp(0 );
    liff.init(function (data) {
        initializeApp(data);
    });
  var url_string = window.location.href
  var url = new URL(url_string);
  var nPath = url.searchParams.get("ngrok");
  var socketURL = "wss://" + nPath + ".ngrok.io?user=1"
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
            // location.href = "https://line-objects-dev.com/filedump/pics/" + received_msg;
          }
       };
        
       ws.onclose = function() { 
          
          // websocket is closed.
          alert("Connection is closed..."); 
       };
           //SMART MIRROR

    

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
  var loadImage = "https://line-objects-dev.com/filedump/pics/" + pPath;

  var divLINE = document.createElement('div');
  var lowerdiv = document.getElementById("lowerdiv")
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

lowerdiv.appendChild(divLINE);


var divFBroot = document.createElement('div');
divFBroot.setAttribute('id', 'fb-root');
divFBroot.setAttribute('style', '\"position: relative; text-align: center;\"');

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

lowerdiv.appendChild(divFBroot);
lowerdiv.appendChild(divFB);

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
    document.getElementById("framePic").src = "assets/pics/frame"+frame_no+".svg"
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
