---
title: Basic Synth Journal
---

I am on a mission to re-write Fabfilter's One Synth using web audio api, mostly just to learn javscript, audio synthesis and web audio programming. 
In this post I will add updates to my progress. Newest updates on top. Latest updates available at the <a href="https://git.emanuelrgz.com/ergz/simple-synth" target="_blank">Simple Synth repo</a>.

## 10/14/2023

Made the app be dark, and added a filter, its ok for now. I will probably pause this projet for a bit, I may explore porting over this to a native
app using imgui.

## 10/13/2023

Today I want to focus on getting the master volume and voice working together. At the moment they causing the signal to clip, so need to resolve this.
THe problem is exactly what I through, namely the volumes wil add up to over 1 and causing the clip. Did not really come to a good solution for now, but
I want to move on to work on some of the other features of the synth. For now I let the clipping happen but let the user know what I happening by showing 
a red background to the viz.


## 10/12/2023

Added detune to the rest of the voices and the visualization as well. Also deployed the site to github pages: <a href="https://ergz.github.io/simple-synth/" target="_blank">Simple Synth</a>


## 10/10/2023

Decided to keep going with UI stuff and created an visualization for the oscillator, only implented on the first one for now, but here is 
what it looks like now.

<video src="https://emanuelrgz-content.sfo3.cdn.digitaloceanspaces.com/simple-synth/osc-viz-example.mp4" controls="controls" style="max-width: 730px;"></video>


## 10/7/2023

Decided to work on the UI a little today, am using tailwind css, not really looking to use all features of tailwind, I am just too 
lazy to write my own css. This is what it looks like now. 

![Simple Synth UI Update](https://emanuelrgz-content.sfo3.cdn.digitaloceanspaces.com/simple-synth/simple-synth-ui-update-2023-10-08.png)

Here is a little sketch what I eventually want the UI to have in the voices:

![A vision](https://emanuelrgz-content.sfo3.cdn.digitaloceanspaces.com/simple-synth/Screenshot%202023-10-08%20at%203.22.39%E2%80%AFAM.png)


## 10/6/2023

New way to move betweem the octaves, much simpler to code, and more similar to what you would see in an analog synth. Here I demo the
three voices with some detune to get that chorus effect. Next up is making the wave selector work for this rewrite and the keyboard
work as well.

<video src="https://emanuelrgz-content.sfo3.cdn.digitaloceanspaces.com/simple-synth/simple-synth-2023-10-06-new-octave-selector.mp4" controls="controls" style="max-width: 730px;"></video>

Next up:

- [ ] Hook up waveform selection
- [ ] Hook up keyboard
- [ ] Add detune to all voices (and maybe an auto-spread knob??)
- [ ] White Noise
- [ ] Filters
- [ ] Filter modulation

The filters I think is where the most fun will be. Eventually I will want to make it look pretty, maybe its worth tackling that 
before I start writting more HTML this sorta basic way.

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
    synth.startOsc(osc3);
    synth.audioContext.resume();
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

