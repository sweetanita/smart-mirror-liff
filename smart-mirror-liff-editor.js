window.onload = function (e) {
    liff.init(function (data) {
        initializeApp(data);
    });
    if ("WebSocket" in window) {
        var wsURL = "wss://cd817695.ngrok.io?user=1"
       // alert("WebSocket is supported by your Browser!");
       
       // Let us open a web socket
       var ws = new WebSocket(wsURL, ["liff-client"]);
        
       ws.onopen = function() {
          
          // Web Socket is connected, send data using send()
          ws.send("Connected");
          document.getElementById('shutterbutton').style.display = "block"
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
        document.getElementById('shutterbutton').addEventListener('click', function () {
            ws.binaryType = 'arraybuffer';
            ws.send(new Uint8Array([55]));
            document.getElementById('shutterbutton').disabled = true;
            window.alert("Processing Image. Please wait.")
            document.body.style.filter = 'grayscale(1)';
        });

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
  var pPath = url.searchParams.get("p");
    document.getElementById('userPic').src = "https://line-objects-dev.com/filedump/pics/" + pPath;
  

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