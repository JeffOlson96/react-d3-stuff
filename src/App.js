import React from 'react';
import { Component } from 'react';
import './App.css';
import res from './res.csv';
import * as d3 from 'd3';
import rd3 from 'react-d3-library';
import BarChart from "./BarChart.js";
import PieChart from "./PieChart.js";




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
        <div id="Bar">
          <BarChart/>
        </div>
        <div id="Pie">
          <PieChart/>
        </div>
      </div>
    )     
  }
}

export default PBIApp;













