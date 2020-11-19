Uint8Array.prototype.slice||Object.defineProperty(Uint8Array.prototype,"slice",{value:function(e,t){return new Uint8Array(Array.prototype.slice.call(this,e,t))}});var CreateAgentRemoteDesktop=function(e,t){var h={};"string"==typeof(h.CanvasId=e)&&(h.CanvasId=Q(e)),h.Canvas=h.CanvasId.getContext("2d"),h.scrolldiv=t,h.State=0,h.PendingOperations=[],h.tilesReceived=0,h.TilesDrawn=0,h.KillDraw=0,h.ipad=!1,h.tabletKeyboardVisible=!1,h.LastX=0,h.LastY=0,h.touchenabled=0,h.submenuoffset=0,h.touchtimer=null,h.TouchArray={},h.connectmode=0,h.connectioncount=0,h.rotation=0,h.protocol=2,h.debugmode=0,h.firstUpKeys=[],h.stopInput=!1,h.localKeyMap=!0,h.remoteKeyMap=!0,h.pressedKeys=[],h.sessionid=0,h.username,h.oldie=!1,h.CompressionLevel=50,h.ScalingLevel=1024,h.FrameRateTimer=100,h.SwapMouse=!1,h.FirstDraw=!1,h.ScreenWidth=960,h.ScreenHeight=701,h.width=960,h.height=960,h.displays=null,h.selectedDisplay=null,h.onScreenSizeChange=null,h.onMessage=null,h.onConnectCountChanged=null,h.onDebugMessage=null,h.onTouchEnabledChanged=null,h.onDisplayinfo=null;var g=!(h.accumulator=null),p="default";h.mouseCursorActive=function(e){g!=e&&(g=e,h.CanvasId.style.cursor=1==e?p:"default")};var S=["default","progress","crosshair","pointer","help","text","no-drop","move","nesw-resize","ns-resize","nwse-resize","w-resize","alias","wait","none","not-allowed","col-resize","row-resize","copy","zoom-in","zoom-out"];h.Start=function(){h.State=0,h.accumulator=null},h.Stop=function(){h.setRotation(0),h.UnGrabKeyInput(),h.UnGrabMouseInput(),h.touchenabled=0,null!=h.onScreenSizeChange&&h.onScreenSizeChange(h,h.ScreenWidth,h.ScreenHeight,h.CanvasId),h.Canvas.clearRect(0,0,h.CanvasId.width,h.CanvasId.height)},h.xxStateChange=function(e){if(h.State!=e)switch(h.State=e,h.CanvasId.style.cursor="default",e){case 0:h.Stop()}},h.send=function(e){2<h.debugmode&&console.log("KSend("+e.length+"): "+rstr2hex(e)),null!=h.parent&&h.parent.send(e)},h.ProcessPictureMsg=function(e,t,n){var o=new Image;o.xcount=h.tilesReceived++;for(var a=h.tilesReceived,r=e.slice(4),i=0,s=[];5e4<r.byteLength-i;)s.push(String.fromCharCode.apply(null,r.slice(i,i+5e4))),i+=5e4;0<i?s.push(String.fromCharCode.apply(null,r.slice(i))):s.push(String.fromCharCode.apply(null,r)),o.src="data:image/jpeg;base64,"+btoa(s.join("")),o.onload=function(){if(null!=h.Canvas&&h.KillDraw<a&&0!=h.State)for(h.PendingOperations.push([a,2,o,t,n]);h.DoPendingOperations(););else h.PendingOperations.push([a,0])},o.error=function(){console.log("DecodeTileError")}},h.DoPendingOperations=function(){if(0==h.PendingOperations.length)return!1;for(var e=0;e<h.PendingOperations.length;e++){var t=h.PendingOperations[e];if(t[0]==h.TilesDrawn+1)return 1==t[1]?h.ProcessCopyRectMsg(t[2]):2==t[1]&&(h.Canvas.drawImage(t[2],h.rotX(t[3],t[4]),h.rotY(t[3],t[4])),delete t[2]),h.PendingOperations.splice(e,1),delete t,h.TilesDrawn++,h.TilesDrawn==h.tilesReceived&&h.KillDraw<h.TilesDrawn&&(h.KillDraw=h.TilesDrawn=h.tilesReceived=0),!0}return h.oldie&&0<h.PendingOperations.length&&h.TilesDrawn++,!1},h.ProcessCopyRectMsg=function(e){var t=((255&e.charCodeAt(0))<<8)+(255&e.charCodeAt(1)),n=((255&e.charCodeAt(2))<<8)+(255&e.charCodeAt(3)),o=((255&e.charCodeAt(4))<<8)+(255&e.charCodeAt(5)),a=((255&e.charCodeAt(6))<<8)+(255&e.charCodeAt(7)),r=((255&e.charCodeAt(8))<<8)+(255&e.charCodeAt(9)),i=((255&e.charCodeAt(10))<<8)+(255&e.charCodeAt(11));h.Canvas.drawImage(Canvas.canvas,t,n,r,i,o,a,r,i)},h.SendUnPause=function(){1<h.debugmode&&console.log("SendUnPause"),h.send(String.fromCharCode(0,8,0,5,0))},h.SendPause=function(){1<h.debugmode&&console.log("SendPause"),h.send(String.fromCharCode(0,8,0,5,1))},h.SendCompressionLevel=function(e,t,n,o){t&&(h.CompressionLevel=t),n&&(h.ScalingLevel=n),o&&(h.FrameRateTimer=o),h.send(String.fromCharCode(0,5,0,10,e,h.CompressionLevel)+h.shortToStr(h.ScalingLevel)+h.shortToStr(h.FrameRateTimer))},h.SendRefresh=function(){h.send(String.fromCharCode(0,6,0,4))},h.ProcessScreenMsg=function(e,t){if(0<h.debugmode&&console.log("ScreenSize: "+e+" x "+t),h.ScreenWidth!=e||h.ScreenHeight!=t){for(h.Canvas.setTransform(1,0,0,1,0,0),h.rotation=0,h.FirstDraw=!0,h.ScreenWidth=h.width=e,h.ScreenHeight=h.height=t,h.KillDraw=h.tilesReceived;0<h.PendingOperations.length;)h.PendingOperations.shift();h.SendCompressionLevel(1),h.SendUnPause(),null!=h.onScreenSizeChange&&h.onScreenSizeChange(h,h.ScreenWidth,h.ScreenHeight,h.CanvasId)}},h.ProcessBinaryCommand=function(e,t,n){var o,a;switch(3!=e&&4!=e&&7!=e||(o=(n[4]<<8)+n[5],a=(n[6]<<8)+n[7]),2<h.debugmode&&console.log("CMD",e,t,o,a),null!=h.recordedData&&(65e3<t?h.recordedData.push(v(2,1,h.shortToStr(27)+h.shortToStr(8)+h.intToStr(t)+h.shortToStr(e)+h.shortToStr(0)+h.shortToStr(0)+h.shortToStr(0)+String.fromCharCode.apply(null,n))):h.recordedData.push(v(2,1,String.fromCharCode.apply(null,n)))),e){case 3:h.FirstDraw&&h.onResize(),h.ProcessPictureMsg(n.slice(4),o,a);break;case 7:h.ProcessScreenMsg(o,a),h.SendKeyMsgKC(h.KeyAction.UP,16),h.SendKeyMsgKC(h.KeyAction.UP,17),h.SendKeyMsgKC(h.KeyAction.UP,18),h.SendKeyMsgKC(h.KeyAction.UP,91),h.SendKeyMsgKC(h.KeyAction.UP,92),h.SendKeyMsgKC(h.KeyAction.UP,16),h.send(String.fromCharCode(0,14,0,4));break;case 11:var r=0,i={},s=(n[4]<<8)+n[5];if(0<s){r=(n[6+2*s]<<8)+n[7+2*s];for(var c=0;c<s;c++){var u=(n[6+2*c]<<8)+n[7+2*c];i[u]=65535==u?"All Displays":"Display "+u}}h.displays=i,h.selectedDisplay=r,null!=h.onDisplayinfo&&h.onDisplayinfo(h,i,r);break;case 12:break;case 14:h.touchenabled=1,h.TouchArray={},null!=h.onTouchEnabledChanged&&h.onTouchEnabledChanged(h.touchenabled);break;case 15:h.TouchArray={};break;case 17:var l=String.fromCharCode.apply(null,data.slice(4));console.log("Got KVM Message: "+l),null!=h.onMessage&&h.onMessage(l,h);break;case 65:"."!=(l=String.fromCharCode.apply(null,data.slice(4)))[0]?(console.log(l),h.parent&&h.parent.setConsoleMessage&&h.parent.setConsoleMessage(l)):console.log("KVM: "+l.substring(1));break;case 88:if(5!=t)break;var d=n[4];S.length<d&&(d=0),p=S[d],g&&(h.CanvasId.style.cursor=p);break;default:console.log("Unknown command",e,t)}},h.MouseButton={NONE:0,LEFT:2,RIGHT:8,MIDDLE:32},h.KeyAction={NONE:0,DOWN:1,UP:2,SCROLL:3,EXUP:4,EXDOWN:5,DBLCLICK:6},h.InputType={KEY:1,MOUSE:2,CTRLALTDEL:10,TOUCH:15,KEYUNICODE:85},h.Alternate=0;var o={Pause:19,CapsLock:20,Space:32,Quote:222,Minus:189,NumpadMultiply:106,NumpadAdd:107,PrintScreen:44,Comma:188,NumpadSubtract:109,NumpadDecimal:110,Period:190,Slash:191,NumpadDivide:111,Semicolon:186,Equal:187,OSLeft:91,BracketLeft:219,OSRight:91,Backslash:220,BracketRight:221,ContextMenu:93,Backquote:192,NumLock:144,ScrollLock:145,Backspace:8,Tab:9,Enter:13,NumpadEnter:13,Escape:27,Delete:46,Home:36,PageUp:33,PageDown:34,ArrowLeft:37,ArrowUp:38,ArrowRight:39,ArrowDown:40,End:35,Insert:45,F1:112,F2:113,F3:114,F4:115,F5:116,F6:117,F7:118,F8:119,F9:120,F10:121,F11:122,F12:123,ShiftLeft:16,ShiftRight:16,ControlLeft:17,ControlRight:17,AltLeft:18,AltRight:18,MetaLeft:91,MetaRight:92,VolumeMute:181};function v(e,t,n){var o=Date.now();return"number"==typeof n?(h.recordedSize+=n,h.shortToStr(e)+h.shortToStr(t)+h.intToStr(n)+h.intToStr(o>>32)+h.intToStr(32&o)):(h.recordedSize+=n.length,h.shortToStr(e)+h.shortToStr(t)+h.intToStr(n.length)+h.intToStr(o>>32)+h.intToStr(32&o)+n)}return h.SendKeyMsg=function(e,t){var n;null!=e&&((t=t||window.event).code&&0==h.localKeyMap?null!=(n=function(e){return e.code.startsWith("Key")&&4==e.code.length?e.code.charCodeAt(3):e.code.startsWith("Digit")&&6==e.code.length?e.code.charCodeAt(5):e.code.startsWith("Numpad")&&7==e.code.length?e.code.charCodeAt(6)+48:o[e.code]}(t))&&h.SendKeyMsgKC(e,n):(59==(n=t.keyCode)?n=186:173==n?n=189:61==n&&(n=187),h.SendKeyMsgKC(e,n)))},h.SendMessage=function(e){3==h.State&&h.send(String.fromCharCode(0,17)+h.shortToStr(4+e.length)+e)},h.SendKeyMsgKC=function(e,t){if(3==h.State)if("object"==typeof e)for(var n in e)h.SendKeyMsgKC(e[n][0],e[n][1]);else{if(1==e)-1==h.pressedKeys.indexOf(t)&&h.pressedKeys.unshift(t);else if(2==e){-1!=(n=h.pressedKeys.indexOf(t))&&h.pressedKeys.splice(n,1)}h.send(String.fromCharCode(0,h.InputType.KEY,0,6,e-1,t))}},h.SendStringUnicode=function(e){if(3==h.State)for(var t=0;t<e.length;t++)h.send(String.fromCharCode(0,h.InputType.KEYUNICODE,0,7,0)+ShortToStr(e.charCodeAt(t)))},h.SendKeyUnicode=function(e,t){3==h.State&&h.send(String.fromCharCode(0,h.InputType.KEYUNICODE,0,7,e-1)+ShortToStr(t))},h.sendcad=function(){h.SendCtrlAltDelMsg()},h.SendCtrlAltDelMsg=function(){3==h.State&&h.send(String.fromCharCode(0,h.InputType.CTRLALTDEL,0,4))},h.SendEscKey=function(){3==h.State&&h.send(String.fromCharCode(0,h.InputType.KEY,0,6,0,27,0,h.InputType.KEY,0,6,1,27))},h.SendStartMsg=function(){h.SendKeyMsgKC(h.KeyAction.EXDOWN,91),h.SendKeyMsgKC(h.KeyAction.EXUP,91)},h.SendCharmsMsg=function(){h.SendKeyMsgKC(h.KeyAction.EXDOWN,91),h.SendKeyMsgKC(h.KeyAction.DOWN,67),h.SendKeyMsgKC(h.KeyAction.UP,67),h.SendKeyMsgKC(h.KeyAction.EXUP,91)},h.SendTouchMsg1=function(e,t,n,o){3==h.State&&h.send(String.fromCharCode(0,h.InputType.TOUCH)+h.shortToStr(14)+String.fromCharCode(1,e)+h.intToStr(t)+h.shortToStr(n)+h.shortToStr(o))},h.SendTouchMsg2=function(e,t){var n,o="";for(var a in h.TouchArray)a==e?n=t:1==h.TouchArray[a].f?(n=65542,h.TouchArray[a].f=3,"START"+a):2==h.TouchArray[a].f?(n=262144,"STOP"+a):n=131078,o+=String.fromCharCode(a)+h.intToStr(n)+h.shortToStr(h.TouchArray[a].x)+h.shortToStr(h.TouchArray[a].y),2==h.TouchArray[a].f&&delete h.TouchArray[a];3==h.State&&h.send(String.fromCharCode(0,h.InputType.TOUCH)+h.shortToStr(5+o.length)+String.fromCharCode(2)+o),0==Object.keys(h.TouchArray).length&&null!=h.touchtimer&&(clearInterval(h.touchtimer),h.touchtimer=null)},h.SendMouseMsg=function(e,t){if(3==h.State&&null!=e&&null!=h.Canvas){if(!t)t=window.event;var n=h.Canvas.canvas.height/h.CanvasId.clientHeight,o=h.Canvas.canvas.width/h.CanvasId.clientWidth,a=h.GetPositionOfControl(h.Canvas.canvas),r=(t.pageX-a[0])*o,i=(t.pageY-a[1])*n;if(t.addx&&(r+=t.addx),t.addy&&(i+=t.addy),0<=r&&r<=h.Canvas.canvas.width&&0<=i&&i<=h.Canvas.canvas.height){var s=0,c=0;e==h.KeyAction.UP||e==h.KeyAction.DOWN?t.which?s=1==t.which?h.MouseButton.LEFT:2==t.which?h.MouseButton.MIDDLE:h.MouseButton.RIGHT:t.button&&(s=0==t.button?h.MouseButton.LEFT:1==t.button?h.MouseButton.MIDDLE:h.MouseButton.RIGHT):e==h.KeyAction.SCROLL&&(t.detail?c=120*t.detail*-1:t.wheelDelta&&(c=3*t.wheelDelta)),!0===h.SwapMouse&&(s==h.MouseButton.LEFT?s=h.MouseButton.RIGHT:s==h.MouseButton.RIGHT&&(s=h.MouseButton.LEFT));var u="";if(e==h.KeyAction.DBLCLICK)u=String.fromCharCode(0,h.InputType.MOUSE,0,10,0,136,r/256&255,255&r,i/256&255,255&i);else if(e==h.KeyAction.SCROLL){var l=0,d=0;d=c<0?(l=255-(Math.abs(c)>>8),255-(255&Math.abs(c))):(l=c>>8,255&c),u=String.fromCharCode(0,h.InputType.MOUSE,0,12,0,0,r/256&255,255&r,i/256&255,255&i,l,d)}else u=String.fromCharCode(0,h.InputType.MOUSE,0,10,0,e==h.KeyAction.DOWN?s:2*s&255,r/256&255,255&r,i/256&255,255&i);h.Action==h.KeyAction.NONE?0==h.Alternate||h.ipad?(h.send(u),h.Alternate=1):h.Alternate=0:h.send(u)}}},h.GetDisplayNumbers=function(){h.send(String.fromCharCode(0,11,0,4))},h.SetDisplay=function(e){h.send(String.fromCharCode(0,12,0,6,e>>8,255&e))},h.intToStr=function(e){return String.fromCharCode(e>>24&255,e>>16&255,e>>8&255,255&e)},h.shortToStr=function(e){return String.fromCharCode(e>>8&255,255&e)},h.onResize=function(){0!=h.ScreenWidth&&0!=h.ScreenHeight&&(h.Canvas.canvas.width==h.ScreenWidth&&h.Canvas.canvas.height==h.ScreenHeight||(h.FirstDraw&&(h.Canvas.canvas.width=h.ScreenWidth,h.Canvas.canvas.height=h.ScreenHeight,h.Canvas.fillRect(0,0,h.ScreenWidth,h.ScreenHeight),null!=h.onScreenSizeChange&&h.onScreenSizeChange(h,h.ScreenWidth,h.ScreenHeight,h.CanvasId)),h.FirstDraw=!1,1<h.debugmode&&console.log("onResize: "+h.ScreenWidth+" x "+h.ScreenHeight)))},h.xxMouseInputGrab=!1,h.xxKeyInputGrab=!1,h.xxMouseMove=function(e){return 3==h.State&&h.SendMouseMsg(h.KeyAction.NONE,e),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},h.xxMouseUp=function(e){return 3==h.State&&h.SendMouseMsg(h.KeyAction.UP,e),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},h.xxMouseDown=function(e){return 3==h.State&&h.SendMouseMsg(h.KeyAction.DOWN,e),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},h.xxMouseDblClick=function(e){return 3==h.State&&h.SendMouseMsg(h.KeyAction.DBLCLICK,e),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},h.xxDOMMouseScroll=function(e){return 3!=h.State||(h.SendMouseMsg(h.KeyAction.SCROLL,e),!1)},h.xxMouseWheel=function(e){return 3!=h.State||(h.SendMouseMsg(h.KeyAction.SCROLL,e),!1)},h.xxKeyUp=function(e){return"Dead"!=e.key&&3==h.State&&(1==e.key.length&&(0==h.remoteKeyMap||0<h.debugmode)?h.SendKeyUnicode(h.KeyAction.UP,e.key.charCodeAt(0)):h.SendKeyMsg(h.KeyAction.UP,e)),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},h.xxKeyDown=function(e){return"Dead"!=e.key&&3==h.State&&(1==e.key.length&&(0==h.remoteKeyMap||0<h.debugmode)?h.SendKeyUnicode(h.KeyAction.DOWN,e.key.charCodeAt(0)):h.SendKeyMsg(h.KeyAction.DOWN,e)),e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},h.xxKeyPress=function(e){return e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},h.handleKeys=function(e){return 1!=h.stopInput&&3==desktop.State&&h.xxKeyPress(e)},h.handleKeyUp=function(e){if(1==h.stopInput||3!=desktop.State)return!1;if(h.firstUpKeys.length<5&&(h.firstUpKeys.push(e.keyCode),5==h.firstUpKeys.length)){var t=h.firstUpKeys.join(",");"16,17,91,91,16"!=t&&"16,17,18,91,92"!=t||(h.stopInput=!0)}return h.xxKeyUp(e)},h.handleKeyDown=function(e){return 1!=h.stopInput&&3==desktop.State&&h.xxKeyDown(e)},h.handleReleaseKeys=function(){var e=JSON.parse(JSON.stringify(h.pressedKeys));for(var t in e)h.SendKeyMsgKC(h.KeyAction.UP,e[t])},h.mousedblclick=function(e){return 1!=h.stopInput&&h.xxMouseDblClick(e)},h.mousedown=function(e){return 1!=h.stopInput&&h.xxMouseDown(e)},h.mouseup=function(e){return 1!=h.stopInput&&h.xxMouseUp(e)},h.mousemove=function(e){return 1!=h.stopInput&&h.xxMouseMove(e)},h.mousewheel=function(e){return 1!=h.stopInput&&h.xxMouseWheel(e)},h.xxMsTouchEvent=function(e){if(4!=e.originalEvent.pointerType){if(e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),"MSPointerDown"==e.type||"MSPointerMove"==e.type||"MSPointerUp"==e.type){var t=0,n=e.originalEvent.pointerId%256,o=e.offsetX*(Canvas.canvas.width/h.CanvasId.clientWidth),a=e.offsetY*(Canvas.canvas.height/h.CanvasId.clientHeight);"MSPointerDown"==e.type?t=65542:"MSPointerMove"==e.type?t=131078:"MSPointerUp"==e.type&&(t=262144),h.TouchArray[n]||(h.TouchArray[n]={x:o,y:a}),h.SendTouchMsg2(n,t),"MSPointerUp"==e.type&&delete h.TouchArray[n]}else alert(e.type);return!0}},h.xxTouchStart=function(e){if(3==h.State)if(e.preventDefault&&e.preventDefault(),0==h.touchenabled||1==h.touchenabled){if(1<e.originalEvent.touches.length)return;var t=e.originalEvent.touches[0];e.which=1,h.LastX=e.pageX=t.pageX,h.LastY=e.pageY=t.pageY,h.SendMouseMsg(KeyAction.DOWN,e)}else{var n=h.GetPositionOfControl(Canvas.canvas);for(var o in e.originalEvent.changedTouches)if(e.originalEvent.changedTouches[o].identifier){var a=e.originalEvent.changedTouches[o].identifier%256;h.TouchArray[a]||(h.TouchArray[a]={x:(e.originalEvent.touches[o].pageX-n[0])*(Canvas.canvas.width/h.CanvasId.clientWidth),y:(e.originalEvent.touches[o].pageY-n[1])*(Canvas.canvas.height/h.CanvasId.clientHeight),f:1})}0<Object.keys(h.TouchArray).length&&null==touchtimer&&(h.touchtimer=setInterval(function(){h.SendTouchMsg2(256,0)},50))}},h.xxTouchMove=function(e){if(3==h.State)if(e.preventDefault&&e.preventDefault(),0==h.touchenabled||1==h.touchenabled){if(1<e.originalEvent.touches.length)return;var t=e.originalEvent.touches[0];e.which=1,h.LastX=e.pageX=t.pageX,h.LastY=e.pageY=t.pageY,h.SendMouseMsg(h.KeyAction.NONE,e)}else{var n=h.GetPositionOfControl(Canvas.canvas);for(var o in e.originalEvent.changedTouches)if(e.originalEvent.changedTouches[o].identifier){var a=e.originalEvent.changedTouches[o].identifier%256;h.TouchArray[a]&&(h.TouchArray[a].x=(e.originalEvent.touches[o].pageX-n[0])*(h.Canvas.canvas.width/h.CanvasId.clientWidth),h.TouchArray[a].y=(e.originalEvent.touches[o].pageY-n[1])*(h.Canvas.canvas.height/h.CanvasId.clientHeight))}}},h.xxTouchEnd=function(e){if(3==h.State)if(e.preventDefault&&e.preventDefault(),0==h.touchenabled||1==h.touchenabled){if(1<e.originalEvent.touches.length)return;e.which=1,e.pageX=LastX,e.pageY=LastY,h.SendMouseMsg(KeyAction.UP,e)}else for(var t in e.originalEvent.changedTouches)if(e.originalEvent.changedTouches[t].identifier){var n=e.originalEvent.changedTouches[t].identifier%256;h.TouchArray[n]&&(h.TouchArray[n].f=2)}},h.GrabMouseInput=function(){if(1!=h.xxMouseInputGrab){var e=h.CanvasId;e.onmousemove=h.xxMouseMove,e.onmouseup=h.xxMouseUp,e.onmousedown=h.xxMouseDown,e.touchstart=h.xxTouchStart,e.touchmove=h.xxTouchMove,e.touchend=h.xxTouchEnd,e.MSPointerDown=h.xxMsTouchEvent,e.MSPointerMove=h.xxMsTouchEvent,e.MSPointerUp=h.xxMsTouchEvent,navigator.userAgent.match(/mozilla/i)?e.DOMMouseScroll=h.xxDOMMouseScroll:e.onmousewheel=h.xxMouseWheel,h.xxMouseInputGrab=!0}},h.UnGrabMouseInput=function(){if(0!=h.xxMouseInputGrab){var e=h.CanvasId;e.onmousemove=null,e.onmouseup=null,e.onmousedown=null,e.touchstart=null,e.touchmove=null,e.touchend=null,e.MSPointerDown=null,e.MSPointerMove=null,e.MSPointerUp=null,navigator.userAgent.match(/mozilla/i)?e.DOMMouseScroll=null:e.onmousewheel=null,h.xxMouseInputGrab=!1}},h.GrabKeyInput=function(){1!=h.xxKeyInputGrab&&(document.onkeyup=h.xxKeyUp,document.onkeydown=h.xxKeyDown,document.onkeypress=h.xxKeyPress,h.xxKeyInputGrab=!0)},h.UnGrabKeyInput=function(){0!=h.xxKeyInputGrab&&(document.onkeyup=null,document.onkeydown=null,document.onkeypress=null,h.xxKeyInputGrab=!1)},h.GetPositionOfControl=function(e){var t=Array(2);for(t[0]=t[1]=0;e;)t[0]+=e.offsetLeft,t[1]+=e.offsetTop,e=e.offsetParent;return t},h.crotX=function(e,t){return 0==h.rotation?e:1==h.rotation?t:2==h.rotation?h.Canvas.canvas.width-e:3==h.rotation?h.Canvas.canvas.height-t:void 0},h.crotY=function(e,t){return 0==h.rotation?t:1==h.rotation?h.Canvas.canvas.width-e:2==h.rotation?h.Canvas.canvas.height-t:3==h.rotation?e:void 0},h.rotX=function(e,t){return 0==h.rotation||1==h.rotation?e:2==h.rotation?e-h.Canvas.canvas.width:3==h.rotation?e-h.Canvas.canvas.height:void 0},h.rotY=function(e,t){return 0==h.rotation||3==h.rotation?t:1==h.rotation?t-h.Canvas.canvas.width:2==h.rotation?t-h.Canvas.canvas.height:void 0},h.tcanvas=null,h.setRotation=function(e){for(;e<0;)e+=4;var t=e%4;if(t==h.rotation)return!0;var n=h.Canvas.canvas.width,o=h.Canvas.canvas.height;1!=h.rotation&&3!=h.rotation||(n=h.Canvas.canvas.height,o=h.Canvas.canvas.width),null==h.tcanvas&&(h.tcanvas=document.createElement("canvas"));var a=h.tcanvas.getContext("2d");return a.setTransform(1,0,0,1,0,0),a.canvas.width=n,a.canvas.height=o,a.rotate(-90*h.rotation*Math.PI/180),0==h.rotation&&a.drawImage(h.Canvas.canvas,0,0),1==h.rotation&&a.drawImage(h.Canvas.canvas,-h.Canvas.canvas.width,0),2==h.rotation&&a.drawImage(h.Canvas.canvas,-h.Canvas.canvas.width,-h.Canvas.canvas.height),3==h.rotation&&a.drawImage(h.Canvas.canvas,0,-h.Canvas.canvas.height),0!=h.rotation&&2!=h.rotation||(h.Canvas.canvas.height=n,h.Canvas.canvas.width=o),1!=h.rotation&&3!=h.rotation||(h.Canvas.canvas.height=o,h.Canvas.canvas.width=n),h.Canvas.setTransform(1,0,0,1,0,0),h.Canvas.rotate(90*t*Math.PI/180),h.rotation=t,h.Canvas.drawImage(h.tcanvas,h.rotX(0,0),h.rotY(0,0)),h.ScreenWidth=h.Canvas.canvas.width,h.ScreenHeight=h.Canvas.canvas.height,null!=h.onScreenSizeChange&&h.onScreenSizeChange(h,h.ScreenWidth,h.ScreenHeight,h.CanvasId),!0},h.StartRecording=function(){null==h.recordedData&&h.CanvasId.toBlob(function(e){var i=new FileReader;i.readAsArrayBuffer(e),i.onload=function(e){for(var t="",n=new Uint8Array(i.result),o=n.byteLength,a=0;a<o;a++)t+=String.fromCharCode(n[a]);h.recordedData=[],h.recordedStart=Date.now(),h.recordedSize=0,h.recordedData.push(v(1,0,JSON.stringify({magic:"MeshCentralRelaySession",ver:1,time:(new Date).toLocaleString(),protocol:2}))),h.recordedData.push(v(2,1,h.shortToStr(7)+h.shortToStr(8)+h.shortToStr(h.ScreenWidth)+h.shortToStr(h.ScreenHeight)));var r=8+t.length;65e3<r?h.recordedData.push(v(2,1,h.shortToStr(27)+h.shortToStr(8)+h.intToStr(r)+h.shortToStr(3)+h.shortToStr(0)+h.shortToStr(0)+h.shortToStr(0)+t)):h.recordedData.push(v(2,1,h.shortToStr(3)+h.shortToStr(r)+h.shortToStr(0)+h.shortToStr(0)+t))}})},h.StopRecording=function(){if(null!=h.recordedData){var e=h.recordedData;return e.push(v(3,0,"MeshCentralMCREC")),delete h.recordedData,delete h.recordedStart,delete h.recordedSize,e}},h.MuchTheSame=function(e,t){return Math.abs(e-t)<4},h.Debug=function(e){console.log(e)},h.getIEVersion=function(){var e=-1;if("Microsoft Internet Explorer"==navigator.appName){var t=navigator.userAgent;null!=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(t)&&(e=parseFloat(RegExp.$1))}return e},h.haltEvent=function(e){return e.preventDefault&&e.preventDefault(),e.stopPropagation&&e.stopPropagation(),!1},h}