import ColorPicker from "simple-color-picker";
const { doc } = require("prettier");


var picker = new ColorPicker({
  el: document.getElementById('picker'),
  background: '#656565',
  color: '#00FF00'
});

picker.onChange(hexStringColor => {
  document.body.style.backgroundColor = hexStringColor;
});

function isEnabled() {
  let text = document.getElementById("toggle").textContent;
  return text == "Disable";
}

// Saves options to chrome.storage
const saveOptions = () => {
  const bgcolor = document.getElementById('bg-picker').value;
  const color = picker.getColor();
  const font = document.getElementById('font-picker').value;
  const speed = document.getElementById('speed-picker').value;
  const transparency = document.getElementById('transparency-picker').value;
  const enabled = isEnabled();

  let val = parseInt(font, 10);
  if (val == NaN || val < 5 || val > 100) {
    alert(`Invalid font ${font} must be an integer between 5 and 100.`); return;
  }
  val = parseInt(speed, 10);
  if (val == NaN || val < 1 || val > 50) {
    alert(`Invalid frame rate ${speed} must be an integer between 1 and 50.`); return;
  }
  val = parseFloat(transparency);
  if (val == NaN || val <= 0 || val > 1) {
    alert(`Invalid opacity ${transparency} must be an float between 0 and 1.`); return;
  }

  var items = { 
    bgChoice: bgcolor,
    colorChoice: color, 
    fontChoice: font,
    speedChoice: speed, 
    transparencyChoice: transparency,
    enabledChoice: enabled
  };

  console.log("saving", items);
  chrome.storage.local.set(
    items,
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = `\u2193 Click to save options \u2193`;
      }, 750);
    }
  );
};


// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.local.get(
    ["bgChoice", "colorChoice", "fontChoice", "speedChoice", "transparencyChoice", "enabledChoice"],
    (items) => {
      // only restore options if some options are saved
      if (items.colorChoice) { 
        console.log(items);
        document.getElementById('bg-picker').value = items.bgChoice;       
        picker.setColor(items.colorChoice);
        document.getElementById('font-picker').value = items.fontChoice;
        document.getElementById('speed-picker').value = items.speedChoice;
        document.getElementById('transparency-picker').value = items.transparencyChoice;
        document.getElementById('popup').setAttribute('bgcolor', items.colorChoice);
        if (items.enabledChoice == false) {
          document.getElementById("toggle").textContent = 'Enable';
        }
      }
    }
  );
};

function toggle() {
  if (isEnabled()) {
    document.getElementById("toggle").textContent = 'Enable';
    saveOptions();
  } else {
    document.getElementById("toggle").textContent = 'Disable';
    saveOptions();
  }
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);

const randomColor = () => {
  var randomColor = Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  let choice = "#" + randomColor;
  picker.setColor(choice);
  saveOptions()
  document.getElementById('popup').setAttribute('bgcolor', choice);
}

document.getElementById('random-color').addEventListener('click', randomColor);

document.getElementById('toggle').addEventListener('click', toggle);
