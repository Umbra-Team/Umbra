function audioChatConnect(
  urlacIsOn,
  setUrlacIsOn,
  pc,
  setPc,
  ws,
  setWs,
  roomName
) {
  if (urlacIsOn) {
    pc.close()
    ws.close()
    setUrlacIsOn(!urlacIsOn)
    return
  }
  setUrlacIsOn(!urlacIsOn)

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      //// RTC and tracks for SDP ////
      let pc = new RTCPeerConnection()

      pc.ontrack = function (event) {
        const audio = new Audio();
        const otherPersonStream = new MediaStream([event.track])
        audio.srcObject = otherPersonStream;
        audio.play();
      }

      stream.getTracks().forEach(track => pc.addTrack(track, stream))
      setPc(pc)

      //// WS ////
      let ws = new WebSocket("wss://erlacmaj.com/websocket/" + roomName)
      setWs(ws)

      // Send a heartbeat every 5 seconds
      setInterval(() => {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ event: 'heartbeat', data: 'ping' }));
        }
      }, 5000);

      window.addEventListener('beforeunload', function (event) {
        if (document.visibilityState === 'hidden' && pc) {
          console.log('THIS FIRED')
          pc.close();
          ws.close();
        }
      });

      pc.onicecandidate = e => {
        if (!e.candidate) {
          return
        }

        ws.send(JSON.stringify({ event: 'candidate', data: JSON.stringify(e.candidate) }))
      }

      ws.onclose = function (evt) {
        // window.alert("You have left the audio chatroom")
      }

      ws.onmessage = function (evt) {
        let msg = JSON.parse(evt.data)
        if (!msg) {
          return console.log('failed to parse msg')
        }

        switch (msg.event) {
          case 'offer':
            let offer = JSON.parse(msg.data)
            if (!offer) {
              return console.log('failed to parse answer')
            }

            pc.setRemoteDescription(offer)
              .then(() => pc.createAnswer())
              .then(answer => {
                pc.setLocalDescription(answer)
                ws.send(JSON.stringify({ event: 'answer', data: JSON.stringify(answer) }))
              })
              .catch(error => {
                console.error('Error during setRemoteDescription/createAnswer: ', error)
              })

            return

          case 'candidate':
            let candidate = JSON.parse(msg.data)
            if (!candidate) {
              return console.log('failed to parse candidate')
            }

            pc.addIceCandidate(candidate)
        }
      }

      ws.onerror = function (evt) {
        console.log("ERROR (evt.data): " + evt.data)
        console.log("ERROR (evt): " + evt)
      }
    }).catch(window.alert)
}

export default audioChatConnect;