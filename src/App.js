import React from 'react';
import { Component } from 'react';
import './App.css';
import res from './res.csv';
import * as d3 from 'd3';
import rd3 from 'react-d3-library';
import BarChart from "./BarChart.js";
import PieChart from "./PieChart.js";
import SideBarChart from "./SideBarChart.js";
import AudioComponent from "./AudioComponent.js";




class PBIApp extends Component {
  
  constructor() {
    super();

    this.state = {
      data: []
    };
    
  }
  
  
  render() {
    return (
      <div id="Full">
          <PieChart/>     
      </div>
    )     
  }
}


/*
<SideBarChart/>
<div id="Pie">
          <PieChart/>
        </div>

<AudioComponent/>
*/
export default PBIApp;












