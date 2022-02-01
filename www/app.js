/*
  app.js - Part of grblTouch

  Copyright (c) 2022 Ravi Karoria (www.engilabs.com | karoria@gmail.com)

  grblTouch is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  grblTouch is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  To get a copy of the GNU General Public License, see <http://www.gnu.org/licenses/>.
*/


//section for user customization
const serverUrl = '192.168.1.77'; //change according to ip of grbl controller/server. static IP configuration is strongly recommended.
const wsPort = 81;      //websockets port. default 81
var jogDistanceArray = [0.002, 0.01, 0.1, 1, 5, 25]; //distances are in mm. please don't change this unless you find out its relevance at other places in code
var pollInterval = 150; //use 300-500 for wifi based communication, 150 for wired ethernet
const probethickness = 15.00; // height of Z-probe plate
var jogSpeed = 3000; //in mm/min. this speed is applicable while jogging
var positionSpeed = 6000; //in mm/min. this speed is applicable while directly going to X0, Y0, Z0, etc.
//Be cautious to use Y- and Y+ jog buttons as they are reversed to suit "valay" mini VMC machines which is used for testing this code.

//Following code is not for user customization in general
//main code
var toggleFullScreen = function () {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen();
    }
};
var jogDistanceIndex, selectedFile, fileJson, fileInfo, mcx, mcy, mcz, mca, wcx, wcy, wcz, wca, wcox, wcoy, wcoz, wcoa;
document.writeln("<script type='text/javascript' src='code.js'></script>"); //to link with other js file

function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.visibility = "hidden";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(tabName).style.visibility = "visible";
    evt.currentTarget.className += " active";
}
document.getElementById('jogbtn').click(); //initial click on 'jog' tab to highlight it

var fileUrl = new URL('http://' + serverUrl + '/upload');

function reloadlist() {
    fetch(fileUrl).then(function (response) {
        return response.text();
    }).then(function (text) {
        fileJson = text;
        return fileJson;
    });
    setTimeout(function () {
        fileStr = JSON.parse(fileJson);
        var k = '<tbody>'
        for (i = 0; i < fileStr.files.length; i++) {
            k += '<tr>';
            k += '<td>' + fileStr.files[i].name + '</td>';
            k += '<td>' + fileStr.files[i].size + '</td>';
            k += '</tr>';
        }
        k += '</tbody>';
        document.getElementById('tabledata').innerHTML = k;

        function highlightRow() {
            var table = document.getElementById('tabledata');
            var cells = table.getElementsByTagName('td');
            for (var i = 0; i < cells.length; i++) {
                // Take each cell
                var cell = cells[i];
                // do something on onclick event for cell
                cell.onclick = function () {
                    // Get the row id where the cell exists
                    var rowId = this.parentNode.rowIndex - 1;
                    var rowsNotSelected = table.getElementsByTagName('tr');
                    for (var row = 0; row < rowsNotSelected.length; row++) {
                        rowsNotSelected[row].classList.remove('selected');
                    }
                    var rowSelected = table.getElementsByTagName('tr')[rowId];
                    rowSelected.className += 'selected';
                    //document.getElementsByClassName('selected').style.backgroundColor = "green";
                    selectedFile = rowSelected.cells[0].innerHTML;
                    writeConsole(selectedFile + " is selected. Please check IDLE state before starting.");
                    //document.getElementById('start').style.backgroundColor = "green";
                }
            }
        }
        highlightRow();
    }, 500);
}
reloadlist();

if (window.WebSocket === undefined) {
    console.log("sockets not supported");
} else {
    if (typeof String.prototype.startsWith != "function") {
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) == 0;
        };
    }
    window.addEventListener("load", onLoad, false);
}

function writeConsole(cData) {
    var consoleBox = document.getElementById('console');
    consoleBox.value += '\n' + cData;
    consoleBox.scrollTop = consoleBox.scrollHeight;
    //console.log(cData);
}

var wsUri = 'ws://' + serverUrl + ':' + wsPort;
function onLoad() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function (evt) { onOpen(evt) };
    websocket.onclose = function (evt) { onClose(evt) };
    websocket.onmessage = function (evt) { onMessage(evt) };
    websocket.onerror = function (evt) { onError(evt) };
}

function onOpen(evt) {
    //websocket.send('$I\n');
    //websocket.send('$G\n');
    setInterval(function () {
        websocket.send('?');
    }, pollInterval);
    // setInterval(function () {    //this code can be used if $10 setting can not be done when a state change can push a response similar to $G
    //     websocket.send('\x83');  //acts same as sending $G
    // }, 4*pollInterval);

    var currentJogDistance = 0;
    window.radioClick = function (myRadio) {
        currentJogDistance = Number(myRadio.value);
        jogDistanceIndex = jogDistanceArray.indexOf(currentJogDistance);
    }
    window.increaseJogDistance = function () {
        if (jogDistanceIndex < (jogDistanceArray.length - 1)) {
            jogDistanceIndex++;
        }
        document.getElementById('jd' + jogDistanceIndex).click();
    }
    window.decreaseJogDistance = function () {
        if (jogDistanceIndex > 0) {
            jogDistanceIndex--;
        }
        document.getElementById('jd' + jogDistanceIndex).click();
    }
    document.getElementById('jd3').click(); //initial click on button "1" as default jog distance

    window.Yp = function () {
        //console.log('$J=G91Y' + currentJogDistance + 'F3000');
        websocket.send('$J=G91Y' + currentJogDistance + 'F' + jogSpeed + '\n');
    }
    window.Ym = function () {
        //console.log('$J=G91Y-' + currentJogDistance + 'F3000');
        websocket.send('$J=G91Y-' + currentJogDistance + 'F' + jogSpeed + '\n');
    }
    window.Xp = function () {
        // console.log('$J=G91X' + currentJogDistance + 'F3000');
        websocket.send('$J=G91X' + currentJogDistance + 'F' + jogSpeed + '\n');
    }
    window.Xm = function () {
        // console.log('$J=G91X-' + currentJogDistance + '3000');
        websocket.send('$J=G91X-' + currentJogDistance + 'F' + jogSpeed + '\n');
    }
    window.Zp = function () {
        // console.log('$J=G91Z' + currentJogDistance + 'F3000');
        websocket.send('$J=G91Z' + currentJogDistance + 'F' + jogSpeed + '\n');
    }
    window.Zm = function () {
        // console.log('$J=G91Z-' + currentJogDistance + 'F3000');
        websocket.send('$J=G91Z-' + currentJogDistance + 'F' + jogSpeed + '\n');
    }
    window.Ap = function () {
        // console.log('$J=G91Z' + currentJogDistance + 'F3000');
        websocket.send('$J=G91A' + currentJogDistance + 'F' + jogSpeed + '\n');
    }
    window.Am = function () {
        // console.log('$J=G91Z-' + currentJogDistance + 'F3000');
        websocket.send('$J=G91A-' + currentJogDistance + 'F' + jogSpeed + '\n');
    }
    window.Bp = function () {
        // console.log('$J=G91Z' + currentJogDistance + 'F3000');
        websocket.send('$J=G91B' + currentJogDistance + 'F' + jogSpeed + '\n');
    }
    window.Bm = function () {
        // console.log('$J=G91Z-' + currentJogDistance + 'F3000');
        websocket.send('$J=G91B-' + currentJogDistance + 'F' + jogSpeed + '\n');
    }
    window.jogCancel = function () {
        websocket.send('\x85');
    }

    window.fovm = function () {
        websocket.send('\x92');
    }
    window.fovr = function () {
        websocket.send('\x90');
    }
    window.fovp = function () {
        websocket.send('\x91');
    }
    window.rov25 = function () {
        websocket.send('\x97');
    }
    window.rov50 = function () {
        websocket.send('\x96');
    }
    window.rov100 = function () {
        websocket.send('\x95');
    }
    window.sovm = function () {
        websocket.send('\x9B');
    }
    window.sovr = function () {
        websocket.send('\x99');
    }
    window.sovp = function () {
        websocket.send('\x9A');
    }
    window.mdi1 = function () {
        var mdi1 = document.getElementById('mdi1').value;
        localStorage.setItem('mymdi1', mdi1); //code for making text input persistant
        websocket.send(mdi1 + '\n');
        // websocket.send('$G\n'); //better strategy can be used to get G54/55 etc states
    }
    window.mdi2 = function () {
        var mdi2 = document.getElementById('mdi2').value;
        localStorage.setItem('mymdi2', mdi2); //code for making text input persistant
        websocket.send(mdi2 + '\n');
        // websocket.send('$G\n'); //better strategy can be used to get G54/55 etc states
    }

    window.x0 = function () {
        websocket.send('G10 P0 L20 X0\n');
    }
    window.y0 = function () {
        websocket.send('G10 P0 L20 Y0\n');
    }
    window.z0 = function () {
        websocket.send('G10 P0 L20 Z0\n');
    }
    window.a0 = function () {
        websocket.send('G10 P0 L20 A0\n');
    }
    window.gox0 = function () {
        websocket.send('$J=G90X0F' + positionSpeed + '\n');
    }
    window.goy0 = function () {
        websocket.send('$J=G90Y0F' + positionSpeed + '\n');
    }
    window.goz0 = function () {
        websocket.send('$J=G90Z0F' + positionSpeed + '\n');
    }
    window.goa0 = function () {
        websocket.send('$J=G90A0F' + positionSpeed + '\n');
    }

    // window.requestOffset = function () {
    //     websocket.send('$G\n');
    // }
    window.reset = function () {
        // console.log('Reset sent');
        websocket.send('\030\n');
        websocket.send('$G\n'); //when reset, grbl sets G54. without timeout it malfunctions
    }

    window.unlock = function () {
        // console.log('Unlock sent');
        websocket.send('$X\n');
    }

    window.home = function () {
        // console.log('Home sent');
        websocket.send('$H\n');
    }

    window.spindle = function () {
        // console.log('Spindle sent');
        websocket.send('M3 S6000\n');
    }

    window.coolant = function () {
        // console.log('Coolant sent');
        websocket.send('M7\n');
    }

    window.start = function () {
        if ((document.getElementById('state').innerHTML) == "Hold:0") {
            websocket.send('~');
            writeConsole('Program resumed.')
        }
        else if ((document.getElementById('state').innerHTML) == "Idle") {
            var runFile = websocket.send('$F=/' + selectedFile + '\n');
            setTimeout(function () {
                if ((document.getElementById('state').innerHTML) == "Run") {
                    writeConsole('Program started from file: ' + selectedFile);
                }
            }, 300);
        }
    }

    window.pause = function () {
        websocket.send('!')
        //document.getElementById('start').style.backgroundColor = "green";
        writeConsole('Program on feedhold. Press start to resume');
    }

    window.probe = function () {
        websocket.send('G91\n');
        websocket.send('G38.2 Z-20 F50\n');
        websocket.send('G90\n');
        websocket.send('G10 L20 P0 Z' + probethickness + '\n');
        websocket.send('G91\n');
        websocket.send('G0 Z50\n');
        websocket.send('G90\n');
    }
}

function onClose(evt) {
    console.log("WebSockets Not connected");
}
// function safe_tags(str) {
//     return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// }
function onMessage(evt) {
    console.log(evt.data);
    if (evt.data[0] == '<') { //These are realtime status reports
        //Code for getting status and modify its style dynamically
        var splitString = evt.data.split("|");
        var state = splitString[0]; //select first element of array
        state = state.substring(1); //remove initial '<' from machine state string
        document.getElementById('state').innerHTML = state;
        switch (state) {
            case 'Idle':
                document.getElementById('state').style.color = 'lightgreen';
                document.getElementById('console').style.color = 'rgb(70,70,70)';
                break;
            case 'Alarm':
                document.getElementById('console').style.color = 'maroon';
            case 'Check':
                document.getElementById('state').style.color = 'red';
                break;
            case 'Jog':
                document.getElementById('state').style.color = 'gold';
                break;
            case 'Run':
            case 'Home':
                document.getElementById('state').style.color = 'white';
                break;
            case 'Hold:0':
            case 'Hold:1':
                document.getElementById('state').style.color = 'pink';
                break;
            case 'Door':
                break;
            case 'Sleep':
                document.getElementById('state').style.color = 'lightgrey';
                break;
        }
        var indexwco = splitString.findIndex(element => element.includes('WCO:'));
        var wco = splitString[indexwco];
        if (wco) {  //used nested if to debug a warning regarding substring property of undefined
            wco = wco.substring(4);
            wco = wco.replace('>', ''); //remove last ">" which may arraive randomly
            wco = wco.split(',');
            wcox = parseFloat(wco[0]);
            wcoy = parseFloat(wco[1]);
            wcoz = parseFloat(wco[2]);
            wcoa = parseFloat(wco[3]);
        }
        var indexmpos = splitString.findIndex(element => element.includes('MPos:'));
        var mpos = splitString[indexmpos];
        if (mpos) {  //used nested if to debug a warning regarding substring property of undefined
            mpos = mpos.substring(5);
            mpos = mpos.split(',');
            mcx = parseFloat(mpos[0]);
            mcy = parseFloat(mpos[1]);
            mcz = parseFloat(mpos[2]);
            if (mpos[3]) {
                mca = parseFloat(mpos[3]);
                //console.log(mca);
            }
            document.getElementById("Xs").value = mcx.toFixed(3);
            document.getElementById("Ys").value = mcy.toFixed(3);
            document.getElementById("Zs").value = mcz.toFixed(3);
            if (mca || mca == 0) {
                document.getElementById("As").value = mca.toFixed(3);
            }
            wcx = mcx - wcox;
            wcy = mcy - wcoy;
            wcz = mcz - wcoz;
            wca = mca - wcoa;
            if (wcx || wcx == 0)
                document.getElementById("Xw").value = wcx.toFixed(3);
            if (wcy || wcy == 0)
                document.getElementById("Yw").value = wcy.toFixed(3);
            if (wcz || wcz == 0)
                document.getElementById("Zw").value = wcz.toFixed(3);
            if (wca || wca == 0)
                document.getElementById("Aw").value = wca.toFixed(3);
        }

        var indexfs = splitString.findIndex(element => element.includes('FS:'));
        var fs = splitString[indexfs];
        if (fs) {  //used nested if to debug a warning regarding substring property of undefined
            fs = fs.substring(3);
            fs = fs.split(',');
            var feed = parseInt(fs[0]);
            var rpm = parseInt(fs[1]);
            document.getElementById("Feed").value = feed;
            document.getElementById("Rpm").value = rpm;
        }

        var indexwcs = splitString.findIndex(element => element.includes('WCS:'));
        var wcs = splitString[indexwcs];
        if (wcs) {  //used nested if to debug a warning regarding substring property of undefined
            wcs = wcs.substring(4);
            wcs = wcs.replace('>', '');
            document.getElementById('woffset').innerHTML = wcs;
        }

        var indexov = splitString.findIndex(element => element.includes('Ov:'));
        var ov = splitString[indexov];
        if (ov) {
            ov = ov.substring(3);
            ov = ov.replace('>', ''); //remove last ">" which may arraive randomly
            ov = ov.split(',');
            var feedov = parseFloat(ov[0]);
            var rapidov = parseFloat(ov[1]);
            var spindleov = parseFloat(ov[2]);
            document.getElementById('fovr').innerHTML = (feedov + '%');
            if (feedov != 100) {
                document.getElementById('fovr').style.backgroundColor = 'black';
            }
            else {
                document.getElementById('fovr').style.backgroundColor = 'rgb(70,70,70)';
            };
            document.getElementById("sovr").innerHTML = (spindleov + '%');
            if (spindleov != 100) {
                document.getElementById('sovr').style.backgroundColor = 'black';
            }
            else {
                document.getElementById('sovr').style.backgroundColor = 'rgb(70,70,70)';
            };
            if (rapidov == 25) {
                document.getElementById('rov25').style.color = 'orange';
                document.getElementById('rov50').style.color = 'lightgrey';
                document.getElementById('rov100').style.color = 'lightgrey';
            }
            else if (rapidov == 50) {
                document.getElementById('rov25').style.color = 'lightgrey';
                document.getElementById('rov50').style.color = 'orange';
                document.getElementById('rov100').style.color = 'lightgrey';
            }
            else if (rapidov == 100) {
                document.getElementById('rov25').style.color = 'lightgrey';
                document.getElementById('rov50').style.color = 'lightgrey';
                document.getElementById('rov100').style.color = 'orange';
            }
        }

        var indexpn = splitString.findIndex(element => element.includes('Pn:'));
        var pn = splitString[indexpn];
        if (pn) {
            pn = pn.substring(3);
            pn = pn.replace('>', ''); //remove last ">" which may arraive randomly
            // io.sockets.emit('pn', pn);
        }

        var indexa = splitString.findIndex(element => element.includes('A:'));
        var a = splitString[indexa];
        if (a) {
            a = a.substring(2);
            a = a.replace('>', ''); //remove last ">"
        }

        var indexsd = splitString.findIndex(element => element.includes('SD:'));
        var sd = splitString[indexsd];
        if (sd) {  //used nested if to debug a warning regarding substring property of undefined
            sd = sd.substring(3);
            sd = sd.replace(/[>]/, ''); //remove last ">" which may arraive randomly
            sd = sd.replace(/[/]/, ''); //remove initial "/" from file /path/name

            sd = sd.split(',');
            var fileProgress = parseFloat(sd[0]).toFixed(1);
            var fileName = sd[1];
            localStorage.setItem('fileName', fileName); //code for making text input persistant
            document.getElementById("fileName").value = fileName;
            if ((document.getElementById('state').innerHTML) == "Run" || "Hold:0") {
                document.getElementById("fileProgress").value = (fileProgress + "%");
                document.getElementById("fileName").style.color = "cyan";
            }
            else {
                document.getElementById("fileProgress").value = ("");
                document.getElementById("fileName").style.color = "lightgrey";

            }
            // io.sockets.emit('sd', sd);
        }

    }
    else if (evt.data.startsWith('ALARM:')) {
        var alarmNum = evt.data.split(/[:\r\n]/); //split by multiple delimiters using RegExp
        alarmNum = alarmNum[1];
        alarmNum = Number(alarmNum);
        var alarmDetail = alarmCodes[alarmNum];
        var alarmData = ("ALARM " + alarmNum + ': ' + alarmDetail);
        writeConsole(alarmData);
    }
    else if (evt.data.includes('error:')) {
        var errorNum = evt.data.split(/[: ]/);
        if (errorNum.length > 2) {
            var errorData = evt.data.replace('SD', 'Program');
        }
        else {
            errorNum = errorNum[1];
            errorNum = Number(errorNum);
            var errorDetail = errorCodes[errorNum];
            var errorData = ("Error " + errorNum + ': ' + errorDetail);
        }
        writeConsole(errorData);
    }
    else if (evt.data.startsWith('[GC:') == true) {
        var gcStr = evt.data.split(' '); //split by multiple delimiters using RegExp
        // console.log(gcStr[1]);
        wOffset = gcStr[1];
        document.getElementById('woffset').innerHTML = wOffset;
    }
    else if (evt.data[0] == '[') {
        var consoleData = evt.data;
        var splitMessage = evt.data.split(":");
        var messageType = splitMessage[0]; //select first element of array
        messageType = messageType.substring(1); //remove initial '[' from string
    }
    else if (!evt.data.includes('ok')) {
        writeConsole(evt.data);
    }
    else {
        console.log(evt.data); // these are mostly "ok" responses
    }
}

function onError(evt) {
    console.log("WebSocket Communication error" + evt);
}

//code for keyboard shortcuts

var isInputFocused = false;

inputFocused = function () {
    isInputFocused = true;
}

inputBlurred = function () {
    isInputFocused = false;
}

var a;
if (localStorage.getItem("a")){
    a = parseFloat(localStorage.getItem("a"));
} else {
    a = 0;
}
document.getElementById('brightness').style.backgroundColor = "rgba(0, 0, 0, " + a + ")";


function increaseBrightness() {
    if (a > 0.1) {
        a = a - 0.1;
    }
    document.getElementById('brightness').style.backgroundColor = "rgba(0, 0, 0, " + a + ")";
    localStorage.setItem("a", a);
    return a;
}
function decreaseBrightness() {
    if (a < 0.5) {
        a = a + 0.1;
    }
    document.getElementById('brightness').style.backgroundColor = "rgba(0, 0, 0, " + a + ")";
    localStorage.setItem("a", a);
    return a;
}

function handleKeyDown(event) {
    if (isInputFocused) {
        return;                     //if input is focussed, keyboard keys should be used for typing instead of assigned tasks
    }
    switch (event.key) {
        case "ArrowRight":
            Xp();
            event.preventDefault(); //this prevents default functions of arrow key in browser
            break;
        case "ArrowLeft":
            Xm();
            event.preventDefault();
            break;
        case "ArrowUp":
            Ym();
            event.preventDefault();
            break;
        case "ArrowDown":
            Yp();
            event.preventDefault();
            break;
        case "PageUp":
            Zp();
            event.preventDefault();
            break;
        case "PageDown":
            Zm();
            event.preventDefault();
            break;
        case "F8":
            coolant();
            event.preventDefault();
            break;
        case "F9":
            spindle();
            event.preventDefault();
            break;
        case "F10":
            websocket.send('M5 M9\n');
            event.preventDefault();
            break;
        case "1":
            document.getElementById('jd0').click();
            break;
        case "2":
            document.getElementById('jd1').click();
            break;
        case "3":
            document.getElementById('jd2').click();
            break;
        case "4":
            document.getElementById('jd3').click();
            break;
        case "5":
            document.getElementById('jd4').click();
            break;
        case "6":
            document.getElementById('jd5').click();
            break;
        case "9":
            start();
            break;
        case "0":
            pause();
            break;
        case "Escape":
            jogCancel();
            event.preventDefault();
            break;
        case "Pause":
            pause();
            break;
        case "p":
            probe();
            break;
        case "r":
            reset();
            break;
        case "u":
            unlock();
            break;
        case "h":
            home();
            break;
        case "f":
            toggleFullScreen();
            break;
        case "q":
            fovm();
            break;
        case "w":
            fovr();
            break;
        case "e":
            fovp();
            break;
        case "a":
            sovm();
            break;
        case "s":
            sovr();
            break;
        case "d":
            sovp();
            break;
        case "z":
            rov25();
            break;
        case "x":
            rov50();
            break;
        case "c":
            rov100();
            break;
        case "F1":
            document.getElementById('jogbtn').click(); //Open Jog tab
            event.preventDefault();
            break;
        case "F2":
            document.getElementById('runbtn').click(); //Open Run tab
            event.preventDefault();
            break;
        case "F3":
            document.getElementById('settingsbtn').click(); //Open Settings tab
            event.preventDefault();
            break;
        case "F6":
            decreaseBrightness();
            writeConsole("Screen brightness: " + Math.round((1 - a) * 100) + "%")
            event.preventDefault();
            break;
        case "F7":
            increaseBrightness();
            writeConsole("Screen brightness: " + Math.round((1 - a) * 100) + "%")
            event.preventDefault();
            break;
        case "=":
        case "+":
            increaseJogDistance();
            event.preventDefault();
            break;
        case '-':
            decreaseJogDistance();
            event.preventDefault();
            break;

        default:
            console.log(event);
    }
}
function handleKeyUp(event) {
    if (isInputFocused) {
        return;
    }
    switch (event.key) {
        case "Shift":
            shiftUp();
            break;
        case "Control":
            ctrlDown = false;
            break;
        case "Alt":
            altUp();
            break;
    }
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);