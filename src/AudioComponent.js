import React from 'react';
import { Component } from 'react';
import res from './res.csv';
import * as d3 from 'd3';
import scale from 'd3-scale';
import WaveSurfer from 'wavesurfer.js';
import song from "./Ode To Viceroy.wav";



//var wavesurfer;


class AudioComponent extends Component {
  
  constructor() {
    super();

    this.state = {
      data: [],
      play: false
    };
    this.clickPlayPause = this.clickPlayPause.bind(this);
    this.clickMute = this.clickMute.bind(this);
    
  }
  componentDidMount() {

    
  }
  
  clickPlayPause(wavesurfer) {
    
    wavesurfer.playPause();
  }

  clickMute(wavesurfer) {
    wavesurfer.toggleMute();
  }


  render() {
    var wavesurfer = WaveSurfer.create({
      container: "#root",
      waveColor: 'steelblue',
      progressColor: 'purple'
    });
    wavesurfer.load(song);
    wavesurfer.setMute(false);
    return (
      <div id="buttons">
        <button onClick={() => this.clickPlayPause(wavesurfer)}>Play</button>
        <button onClick={() => this.clickMute(wavesurfer)}>Toggle Mute</button>
      </div>
    );
  }
}

export default AudioComponent;













