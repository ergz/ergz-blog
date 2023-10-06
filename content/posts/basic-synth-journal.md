---
title: Basic Synth Journal
---

I am on a mission to re-write Fabfilter's One Synth using web audio api, mostly just to learn javscript, audio synthesis and web audio programming. 
In this post I will add updates to my progress. Newest updates on top.

## 10/5/2023

Attempting a refactor of the code before I get further. It seems like putting this together in a class
makes sense as it will keep everything tidy. 

This is the basic synth. A couple things to note, the One from FF has just one oscillator, but I am not adding that limitation 
to this implementation maybe I should.

```javascript
class Synth {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.oscillators = [];
    this.gain = this.audioContext.createGain();
    this.gain.connect(this.audioContext.destination);
  }

  createOscillator(type = "sine", freq = 440) {
    const osc = this.audioContext.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
    osc.connect(this.gain);
    this.oscillators.push(osc);
    return osc;
  }

  startOsc(osc) {
    osc.start();
  }

  stopOsc(osc) {
    osc.stop();
    const index = this.oscillators.indexOf(osc);
    if (index !== -1) {
      this.oscillators.splice(index, 1);
    }
  }

  stopAll() {
    for (let osc of this.oscillators) {
      this.stopOsc(osc);
    }
  }
}
```

this is honestly the most complex js I have ever written, but you gotta start somewhere. So lets break it 
down a bit. So classes behave pretty much the same way they do in any other programming language that 
supports them. They require a `constructor` function, that gets called at initialization of the class.
Classes in JS are created using the `new` keyword, so in this case it would be,

```javascript
let audioConext = new AudioContext();
const s = new Synth(audioContext);
```

this is where I ended up at the end of the night, only had a short amount of time today,

```javascript
class Synth {
  constructor() {
    this.audioContext = new AudioContext();
    this.oscillators = [];
    this.gain = this.audioContext.createGain();
    this.gain.connect(this.audioContext.destination);
  }

  createOscillator(type = "sine", freq = 440) {
    const osc = this.audioContext.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
    this.gain.gain.setTargetAtTime(0.5, this.audioContext.currentTime, 0);
    osc.connect(this.gain);
    this.gain.connect(this.audioContext.destination);
    this.oscillators.push(osc);
    return osc;
  }

  startOsc(osc) {
    osc.start();
  }

  stopOsc(osc) {
    osc.stop();
    const index = this.oscillators.indexOf(osc);
    if (index !== -1) {
      this.oscillators.splice(index, 1);
    }
  }

  stopAll() {
    for (let osc of this.oscillators) {
      this.stopOsc(osc);
    }
  }
}

function hzoctave(freq, octave) {
  return freq * 2 ** octave;
}

function updateFrequency() {
  let selectedNote = document.querySelector(
    "input[name='notechoice']:checked"
  ).value;
  osc.frequency.setValueAtTime(
    noteToHz(selectedNote),
    synth.audioContext.currentTime
  );
}

window.onload = function () {
  let synth = new Synth();
  let osc1 = synth.createOscillator("sawtooth", hzoctave(440, -1));
  let osc2 = synth.createOscillator("sawtooth", hzoctave(440, -1) - 2);
  let osc3 = synth.createOscillator("sawtooth", hzoctave(440, -3));
  // start button

  document.getElementById("activateVoice1").addEventListener("click", () => {
    console.log("voice 1 start clicked");
    synth.audioContext.resume();
    synth.startOsc(osc1);
  });

  document.getElementById("activateVoice2").addEventListener("click", () => {
    console.log("voice 2 start clicked");
    synth.audioContext.resume();
    synth.startOsc(osc2);
  });

  document.getElementById("activateVoice3").addEventListener("click", () => {
    console.log("voice 3 start clicked");
    synth.audioContext.resume();
    synth.startOsc(osc3);
  });

  document
    .querySelectorAll("input[name='notechoice']")
    .forEach((radioButton) => {
      radioButton.addEventListener("change", updateFrequency);
    });
};

```

end result is pretty nice,


<audio controls>
  <source src="https://emanuelrgz-content.sfo3.cdn.digitaloceanspaces.com/audio/simple-synth-3-voices-2023-10-05.mp3" type="audio/mp3">
</audio>



## 10/3/2023

Some basics are done.

- Waveform Selection
- Simple Arp
- Octave Selection
- Gain

<video src="https://emanuelrgz-content.sfo3.cdn.digitaloceanspaces.com/videos/basic-synth-10-03-23.mp4" controls="controls" style="max-width: 730px;"></video>

