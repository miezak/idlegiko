// ==UserScript==
// @name          IdleGiko
// @namespace     idlegiko
// @description   Prevent Gikopoi timeouts
// @include       http://l4cs.jpn.org/gikopoi/flash/gikopoi*/flash_gikopoi.html
// @version       1.1.6
// @grant         none
// ==/UserScript==
(function(doc, win)
{
  doc.body.style.margin = "0";
  
  var gikoUserName = '';
  var textAreaPhone = doc.getElementById('message_txt');
  function sendMessage(message)
  {
    textAreaPhone.removeAttribute('id');
    if(typeof unsafeWindow !== "undefined")
      unsafeWindow.document.gikopoi.JSCallBackSendMessage(message);
    else
      doc.gikopoi.JSCallBackSendMessage(message);
    textAreaPhone.setAttribute('id', 'message_txt');
  }
  
  function getjpdate()
  {
    var time = new Date().toLocaleString("en-US", {timeZone: "Asia/Tokyo", hour12: false});
    return time.substring(time.indexOf(' ')+1);
  }
  
  var objectGikopoi = doc.getElementById('gikopoi');
  objectGikopoi.getElementsByTagName('embed')[0]
    .setAttribute('wmode', 'transparent');
  objectGikopoi.innerHTML = objectGikopoi.innerHTML;
  
  win.addEventListener('load', function()
  {
    if (!gikoUserName)
      return;
    alert('this popup is needed to load the username. sorry!');
    sendMessage(gikoUserName);
  });
                          
  var altTextArea  = doc.createElement('textarea');
  altTextArea.style.display = 'none';
  altTextArea.style.position = 'absolute';
  altTextArea.style.top = '352px';
  altTextArea.style.left = '2px';
  altTextArea.style.width = '380px';
  altTextArea.style.height = '80px';
  
  var altButton = doc.createElement('button');
  altButton.style.display = 'none';
  altButton.setAttribute('type', 'button');
  altButton.textContent = 'Send';
  altButton.style.position = 'absolute';
  altButton.style.top = '435px';
  altButton.style.left = '270px';
  altButton.style.width = '60px';
  altButton.style.height = '28px';
  
  function sendTextArea()
  {
    sendMessage(altTextArea.value);
    altTextArea.value = '';
  }
  
  altButton.addEventListener('click', sendTextArea);
  altTextArea.addEventListener('keydown', function(event)
  {
    if(event.keyCode == 13 && event.shiftKey)
    {
      sendTextArea();
      event.preventDefault();
      return false;
    }
  }, true);
  
  doc.body.appendChild(altButton);
  doc.body.appendChild(altTextArea);
  
  var divPanel = doc.createElement('div');
  /*divPanel.style.position = 'fixed';
  divPanel.style.top = 0;
  divPanel.style.right = 0;*/
  divPanel.style.position = 'absolute';
  divPanel.style.top = '800px';
  //divPanel.style.right = 0;
  
  var buttonRula = doc.createElement('button');
  buttonRula.textContent = 'Rula';
  buttonRula.addEventListener('click', function()
  {
    sendMessage('#rula');
  });
  divPanel.appendChild(buttonRula);
  
  var buttonList = doc.createElement('button');
  buttonList.textContent = 'List';
  buttonList.addEventListener('click', function()
  {
    sendMessage('#list');
  });
  divPanel.appendChild(buttonList);
  
  var buttonInput = doc.createElement('button');
  buttonInput.textContent = 'Input';
  buttonInput.addEventListener('click', function()
  {
    if(altTextArea.style.display == "none")
      altTextArea.style.display = altButton.style.display = 'block';
    else
      altTextArea.style.display = altButton.style.display = 'none';
  });
  divPanel.appendChild(buttonInput);
  
  var awayMsg = '';
  var awayMsgDatePfx = '';
  function sendAwayMsg(prompting = true)
  {
    if (prompting) {
  var msg = prompt("enter your away message", awayMsg ? awayMsg : 'あfk');
  if (msg == null)
  return;
    } else { var msg = awayMsg; }

    if (msg.substring(0,3) == '_nd') {
      if (awayMsgDatePfx)
    awayMsgDatePfx = '';
      sendMessage(msg.substring(3));
    } else {
      if (prompting)
    awayMsgDatePfx = getjpdate() + '： ';
      sendMessage(!msg ? msg : awayMsgDatePfx + msg);
    }

    awayMsg = msg;
    msg = null;
  }
  
  var buttonAwayMsg = doc.createElement('button');
  buttonAwayMsg.textContent = 'Away Message';
  buttonAwayMsg.addEventListener('click', sendAwayMsg);
  divPanel.appendChild(buttonAwayMsg);

  
  var divTimer = doc.createElement('div');
  divTimer.style.color = 'black';
  divTimer.style.position = 'absolute';
  //divTimer.style.right = 0;
  divTimer.style.fontSize = '24px';
  divPanel.appendChild(divTimer);
  
  doc.body.appendChild(divPanel);
  
  var keepAliveTime = null;
  function countDownLoop()
  {
    if(keepAliveTime === null)
    {
      divTimer.style.color = 'black';
      keepAliveTime = new Date().getTime() + (25 * 60 * 1000);
    }
    var left =  Math.round((keepAliveTime - new Date().getTime()) / 1000);
    if(left > 0)
    {
      var minutes = '0' + Math.floor(left / 60);
      var seconds = '0' + (left - (minutes * 60));
      divTimer.textContent = minutes.substr(-2) + ':' + seconds.substr(-2);
      if(left <= 10) divTimer.style.color = 'red';
    }
    else
    {
      sendAwayMsg(false);
      divTimer.textContent = '00:00';
      keepAliveTime = null;
    }
  }

  setInterval(countDownLoop, 1000);
  countDownLoop();
})(document, window);
