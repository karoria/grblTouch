// var numpad = {
//   // (A) CREATE NUMPAD HTML
//   hwrap: null, // numpad wrapper container
//   hpad: null, // numpad itself
//   hdisplay: null, // number display
//   hbwrap: null, // buttons wrapper
//   hbuttons: {}, // individual buttons
//   init: function () {
//     // (A1) WRAPPER
//     numpad.hwrap = document.createElement("div");
//     numpad.hwrap.id = "numWrap";


//     // (A2) ENTIRE NUMPAD ITSELF
//     numpad.hpad = document.createElement("div");
//     numpad.hpad.id = "numPad";
//     numpad.hwrap.appendChild(numpad.hpad);
//     numpad.hpad.tabindex = "0";
//     numpad.hpad.contentEditable = false;
//     numpad.hpad.addEventListener("keydown", numpad.keypr);

//     // (A3) DISPLAY
//     numpad.hdisplay = document.createElement("input");
//     numpad.hdisplay.id = "numDisplay";
//     numpad.hdisplay.type = "text";
//     numpad.hdisplay.disabled = true;
//     numpad.hdisplay.value = "0";
//     numpad.hpad.appendChild(numpad.hdisplay);



//     // (A4) NUMBER BUTTONS
//     numpad.hbwrap = document.createElement("div");
//     numpad.hbwrap.id = "numBWrap";
//     numpad.hpad.appendChild(numpad.hbwrap);

//     // (A5) BUTTONS
//     var buttonator = function (txt, css, fn) {
//       var button = document.createElement("div");
//       button.innerHTML = txt;
//       button.classList.add(css);
//       button.addEventListener("click", fn);
//       numpad.hbwrap.appendChild(button);
//       numpad.hbuttons[txt] = button;
//     };

//     var spacer = function () {
//       buttonator("", "spacer", null);
//     }

//     // 7 8 9 _ Goto
//     for (var i = 7; i <= 9; i++) { buttonator(i, "num", numpad.digit); }
//     buttonator("&#10502;", "del", numpad.delete);
//     spacer();
//     buttonator("Goto", "goto", numpad.gotoCoordinate);

//     // 4 5 6 C _ _
//     for (var i = 4; i <= 6; i++) { buttonator(i, "num", numpad.digit); }
//     buttonator("C", "clr", numpad.reset);
//     spacer();
//     spacer();

//     // 1 2 3 +- Set
//     for (var i = 1; i <= 3; i++) { buttonator(i, "num", numpad.digit); }
//     buttonator("+-", "num", numpad.toggleSign);
//     buttonator("Set", "set", numpad.setCoordinate);

//     // 0 . Get Cancel
//     buttonator(0, "zero", numpad.digit);
//     buttonator(".", "dot", numpad.dot);
//     buttonator("Get", "get", numpad.recall);
//     buttonator("Cancel", "cxwide", numpad.hide);


//     // (A6) ATTACH NUMPAD TO HTML BODY
//     document.body.appendChild(numpad.hwrap);
//   },

//   // (B) BUTTON ACTIONS
//   // (B1) CURRENTLY SELECTED FIELD + MAX LIMIT
//   nowTarget: null, // Current selected input field
//   nowMax: 0, // Current max allowed digits

//   keypr: function (event) {
//     event.preventDefault();
//     switch (event.key) {
//       case "Escape":
//       case "q":
//         numpad.hide();
//         break;
//       case "0":
//       case "1":
//       case "2":
//       case "3":
//       case "4":
//       case "5":
//       case "6":
//       case "7":
//       case "8":
//       case "9":
//         numpad.digitv(event.key);
//         break;
//       case '.':
//         numpad.dot();
//         break;
//       case 'Backspace':
//       case 'Del':
//         numpad.delete();
//         break;
//       case 'x':
//       case 'X':
//         numpad.reset();
//         break;
//       case 'c':
//       case 'C':
//         numpad.reset();
//         break;
//       case 'g':
//       case 'G':
//         numpad.recall();
//         break;
//       case 's':
//       case 'S':
//       case 'Enter':
//         numpad.setCoordinate();
//         break;
//     }
//   },

//   // (B2) NUMBER (0 TO 9)

//   digitv: function (n) {
//     var current = numpad.hdisplay.value;
//     if (current.length < numpad.nowMax) {
//       if (current == "0") {
//         numpad.hdisplay.value = n;
//       } else {
//         numpad.hdisplay.value += n;
//       }
//     }
//   },

//   digit: function () {
//     numpad.digitv(this.innerHTML);
//   },

//   // Change sign
//   toggleSign: function () {
//     numpad.hdisplay.value = -numpad.hdisplay.value;
//   },


//   // ADD DECIMAL POINT
//   dot: function () {
//     if (numpad.hdisplay.value.indexOf(".") == -1) {
//       if (numpad.hdisplay.value == "0") {
//         numpad.hdisplay.value = "0.";
//       } else {
//         numpad.hdisplay.value += ".";
//       }
//     }
//   },

//   // BACKSPACE
//   delete: function () {
//     var length = numpad.hdisplay.value.length;
//     if (length == 1) { numpad.hdisplay.value = 0; }
//     else { numpad.hdisplay.value = numpad.hdisplay.value.substring(0, length - 1); }
//   },

//   // (B5) CLEAR ALL
//   reset: function () { numpad.hdisplay.value = "0"; },

//   // (B6) Recall
//   recall: function () {
//     numpad.hdisplay.value = numpad.nowTarget.textContent;
//   },

//   setCoordinate: function () {
//     numpad.nowTarget.textContent = numpad.hdisplay.value;
//     websocket.send('G10 L20 P0 ' + numpad.nowTarget.dataset.axis + numpad.hdisplay.value);
//     numpad.hide();
//   },

//   gotoCoordinate: function () {
//     numpad.nowTarget.textContent = numpad.hdisplay.value;
//     goAxisByValue(numpad.nowTarget.dataset.axis, numpad.hdisplay.value);
//     numpad.hide();
//   },

//   // (C) ATTACH NUMPAD TO INPUT FIELD
//   attach: function (opt) {
//     // OPTIONS
//     //  target: required, ID of target field.
//     //  max: optional, maximum number of characters. Default 255.
//     //  decimal: optional, allow decimal? Default true.

//     // (C1) DEFAULT OPTIONS
//     if (opt.max === undefined) { opt.max = 255; }
//     if (opt.decimal === undefined) { opt.decimal = true; }

//     // (C2) GET + SET TARGET OPTIONS
//     var target = opt.target;
//     target.readOnly = true;
//     target.dataset.max = opt.max;
//     target.dataset.decimal = opt.decimal;
//     target.dataset.axis = opt.axis;
//     target.dataset.elementName = opt.target;
//     target.addEventListener("click", numpad.show);
//   },

//   // (D) SHOW NUMPAD
//   show: function () {


//     // (D1) SET CURRENT DISPLAY VALUE
//     //var cv = this.value;
//     var cv = "";
//     if (cv == "") { cv = "0"; }
//     numpad.hdisplay.value = cv;

//     // (D2) SET MAX ALLOWED CHARACTERS
//     numpad.nowMax = this.dataset.max;

//     // (D3) SET DECIMAL
//     if (this.dataset.decimal == "true") {
//       numpad.hbwrap.classList.remove("noDec");
//     } else {
//       numpad.hbwrap.classList.add("noDec");
//     }

//     // (D4) SET CURRENT TARGET
//     numpad.nowTarget = this;

//     // (D5) SHOW NUMPAD
//     numpad.hwrap.classList.add("open");

//     // numpad.hpad.focus();
//   },

//   // (E) HIDE NUMPAD
//   hide: function () { numpad.hwrap.classList.remove("open"); },
// };
// window.addEventListener("DOMContentLoaded", numpad.init);





var numpad = {
  // (A) CREATE NUMPAD HTML
  hwrap: null, // numpad wrapper container
  hpad: null, // numpad itself
  hdisplay: null, // number display
  hbwrap: null, // buttons wrapper
  hbuttons: {}, // individual buttons
  init: () => {
    // (A1) WRAPPER
    numpad.hwrap = document.createElement("div");
    numpad.hwrap.id = "numWrap";

    // (A2) ENTIRE NUMPAD ITSELF
    numpad.hpad = document.createElement("div");
    numpad.hpad.id = "numPad";
    numpad.hwrap.appendChild(numpad.hpad);

    // (A3) DISPLAY
    numpad.hdisplay = document.createElement("input");
    numpad.hdisplay.id = "numDisplay";
    numpad.hdisplay.type = "text";
    numpad.hdisplay.disabled = true;
    numpad.hdisplay.value = "0";
    numpad.hpad.appendChild(numpad.hdisplay);

    // (A4) NUMBER BUTTONS
    numpad.hbwrap = document.createElement("div");
    numpad.hbwrap.id = "numBWrap";
    numpad.hpad.appendChild(numpad.hbwrap);

    // (A5) BUTTONS
    let buttonator = (txt, css, fn) => {
      let button = document.createElement("div");
      button.innerHTML = txt;
      button.classList.add(css);
      button.onclick = fn;
      numpad.hbwrap.appendChild(button);
      numpad.hbuttons[txt] = button;
    };

    // 7 TO 9
    for (let i = 7; i <= 9; i++) { buttonator(i, "num", () => { numpad.digit(i); }); }
    // BACKSPACE
    buttonator("BACK", "del", numpad.delete);
    buttonator("GET", "get", numpad.recall);
    // 4 TO 6
    for (let i = 4; i <= 6; i++) { buttonator(i, "num", () => { numpad.digit(i); }); }
    // CLEAR
    buttonator("CLEAR", "clr", numpad.reset);
    buttonator("HALF", "half", numpad.half);
    // 1 to 3
    for (let i = 1; i <= 3; i++) { buttonator(i, "num", () => { numpad.digit(i); }); }
    // CANCEL
    buttonator("+/-", "sign", numpad.toggleSign);
    buttonator("GO", "go", numpad.go);
    // 0
    buttonator(0, "zero", () => { numpad.digit(0); });
    // .
    buttonator(".", "dot", numpad.dot);
    // OK
    buttonator("SET", "ok", numpad.select);
    buttonator("&#10005;", "cx", () => { numpad.hide(1); });

    // (A6) ATTACH NUMPAD TO HTML BODY
    document.body.appendChild(numpad.hwrap);
  },

  // (B) BUTTON ACTIONS
  // (B1) CURRENTLY SELECTED FIELD + MAX LIMIT
  nowTarget: null, // Current selected input field
  nowMax: 0, // Current max allowed digits

  // (B2) NUMBER (0 TO 9)
  digit: (num) => {
    let current = numpad.hdisplay.value;
    if (current.length < numpad.nowMax) {
      if (current == "0") { numpad.hdisplay.value = num; }
      else { numpad.hdisplay.value += num; }
    }
  },

  // (B3) ADD DECIMAL POINT
  dot: () => {
    if (numpad.hdisplay.value.indexOf(".") == -1) {
      if (numpad.hdisplay.value == "0") { numpad.hdisplay.value = "0."; }
      else { numpad.hdisplay.value += "."; }
    }
  },

  // (B4) BACKSPACE
  delete: () => {
    var length = numpad.hdisplay.value.length;
    if (length == 1) { numpad.hdisplay.value = 0; }
    else { numpad.hdisplay.value = numpad.hdisplay.value.substring(0, length - 1); }
  },

  // (B5) CLEAR ALL
  reset: () => { numpad.hdisplay.value = "0"; },

  // (B6-A) Recall
  recall: function () {
    numpad.hdisplay.value = numpad.nowTarget.value;
  },

  // (B6-B) Half
  half: function () {
    numpad.hdisplay.value = numpad.hdisplay.value / 2;
  },

  // (B6-B) Half
  go: function () {
    numpad.hide();
    numpad.nowTarget.dispatchEvent(new Event("numpadgo"));
  },  

    // Change sign
  toggleSign: function () {
    numpad.hdisplay.value = -numpad.hdisplay.value;
  },

  // (B6) OK - SET VALUE
  select: () => {
    numpad.nowTarget.value = numpad.hdisplay.value;
    numpad.hide();
    numpad.nowTarget.dispatchEvent(new Event("numpadok"));
  },

  // (C) ATTACH NUMPAD TO INPUT FIELD
  attach: (opt) => {
    // OPTIONS
    //  target: required, target field.
    //  max: optional, maximum number of characters. Default 255.
    //  decimal: optional, allow decimal? Default true.
    //  onselect: optional, function to call after selecting number.
    //  oncancel: optional, function to call after canceling.

    // (C1) DEFAULT OPTIONS
    if (opt.max === undefined) { opt.max = 8; }
    if (opt.decimal === undefined) { opt.decimal = true; }

    // (C2) GET + SET TARGET OPTIONS
    opt.target.readOnly = true; // PREVENT ONSCREEN KEYBOARD
    opt.target.dataset.max = opt.max;
    opt.target.dataset.decimal = opt.decimal;
    opt.target.addEventListener("click", () => { numpad.show(opt.target); });

    // (C3) ATTACH CUSTOM LISTENERS
    if (opt.onselect) {
      opt.target.addEventListener("numpadok", opt.onselect);
    }
    if (opt.oncancel) {
      opt.target.addEventListener("numpadcx", opt.oncancel);
    }
    if (opt.ongo) {
      opt.target.addEventListener("numpadgo", opt.ongo);
    }
  },


  // (D) SHOW NUMPAD
  show: (target) => {
    // (D1) SET CURRENT DISPLAY VALUE
    let cv = "";   //old was let cv = target.value;
    if (cv == "") { cv = "0"; }
    numpad.hdisplay.value = cv;

    // (D2) SET MAX ALLOWED CHARACTERS
    numpad.nowMax = target.dataset.max;

    // (D3) SET DECIMAL
    if (target.dataset.decimal == "true") {
      numpad.hbwrap.classList.remove("noDec");
    } else {
      numpad.hbwrap.classList.add("noDec");
    }

    // (D4) SET CURRENT TARGET
    numpad.nowTarget = target;

    // (D5) SHOW NUMPAD
    numpad.hwrap.classList.add("open");
  },

  // (E) HIDE NUMPAD
  hide: (manual) => {
    if (manual) { numpad.nowTarget.dispatchEvent(new Event("numpadcx")); }
    numpad.hwrap.classList.remove("open");
  }
};
window.addEventListener("DOMContentLoaded", numpad.init);





window.addEventListener("load", () => {
  // (C2) WITH ALL POSSIBLE OPTIONS
  numpad.attach({
    target: document.getElementById("Xw"),
    onselect: () => { websocket.send('G10 L20 P0 X' + numpad.hdisplay.value + '\n'); },
    ongo: () => { websocket.send('G0 X' + numpad.hdisplay.value + '\n');}
  });
  numpad.attach({
    target: document.getElementById("Yw"),
    onselect: () => { websocket.send('G10 L20 P0 Y' + numpad.hdisplay.value + '\n'); },
    ongo: () => { websocket.send('G0 Y' + numpad.hdisplay.value + '\n');}
  });
  numpad.attach({
    target: document.getElementById("Zw"),
    onselect: () => { websocket.send('G10 L20 P0 Z' + numpad.hdisplay.value + '\n'); },
    ongo: () => { websocket.send('G0 Z' + numpad.hdisplay.value + '\n');}
  });
  numpad.attach({
    target: document.getElementById("Aw"),
    onselect: () => { websocket.send('G10 L20 P0 A' + numpad.hdisplay.value + '\n'); },
    ongo: () => { websocket.send('G0 A' + numpad.hdisplay.value + '\n');}
  });

});