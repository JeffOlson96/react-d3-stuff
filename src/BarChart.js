import React from 'react';
import { Component } from 'react';
import res from './res.csv';
import * as d3 from 'd3';
import scale from 'd3-scale';






class BarChart extends Component {
  
  constructor() {
    super();

    this.state = {
      data: []
    };
    this.drawChart = this.drawChart.bind(this);
    
  }
  componentDidMount() {
    
    this.setState({data: this.props.data});
  }
  componentDidUpdate() {
    this.drawChart(this.props.data);
  }
  
  drawChart(data) {
    //console.log(data);
    
    var info = Array(571);
    var margin = 50;
    
    //console.log(info);
    //const info = [12, 5, 6, 8, 3];
    const svg = d3.select("#root").append("svg").attr("width", 1500).attr("height", 800);
    
    // using scale band for bars
    var x = d3.scaleBand()
            .range([0, 1000])
            .domain(data.map(function(d) {return d.key;}))
            .padding(0.2);
    
    
    // scale Ordinal is helpful for colors
    var color = d3.scaleOrdinal()
              .domain(data)
              .range(d3.schemeSet3);


    // y = mx + b
    var y = d3.scaleLinear()
              .range([0, 1500]);

    
    var bars = svg.selectAll('.bar')
        .data(data)
        .enter()
        .append("g");


    bars.append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => (i * 10) + margin)
        .attr("y", (d, i) => 650 - (d.value * 0.2)) // 300 is height, can be made more dynamic with variables, state to hold info
        .attr("width", 7)
        .attr("height", (d, i) => {
          return d.value * 0.2;
        })
        .attr("fill", function(d) {return color(d.key)});

    bars.append("text")
        .attr("class", "label")
        .text((d) => {
          return d.key;
        })
        .attr("font-size", "4px")
        .attr("transform", (d,i) => { return "translate( " + (((i * 10) + 2) + margin) + ", 670)rotate(-75)"});
    
    bars
        .append("text")
        .attr("class", "value")
        .text((d) => {
          return d.value;
        })
        .attr("x", (d,i) => ((i * 10) - 2) + margin)
        .attr("y", (d,i) => 650 - (d.value * 0.2) - 10)
        .attr("font-size", "4px");

    /*
    var x = d3.scaleBand()
            .range([0, 1000])
            .domain(data.map(function(d) {return d["DEPARTMENT DESCRIPTION"];}))
            .padding(0.2);
    
    

    var color = d3.scaleOrdinal()
              .domain(data)
              .range(d3.schemeSet3);



    var y = d3.scaleLinear()
              .domain([0, 200])
              .range([300, 0]);

    
    var bars = svg.selectAll('.bar')
        .data(data)
        .enter()
        .append("g");

    

    bars.append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => i * 10)
        .attr("y", (d, i) => 300 - d["TIME ENTERED"]) // 300 is height, can be made more dynamic with variables, state to hold info
        .attr("width", 4)
        .attr("height", (d, i) => {
          return d["TIME ENTERED"];
        })
        .attr("fill", function(d) {return color(d["DEPARTMENT DESCRIPTION"])});
        

    bars.append("text")
        .attr("class", "label")
        .text((d) => {
          return d["DEPARTMENT DESCRIPTION"];
        })
        .attr("font-size", "4px")
        .attr("transform", (d,i) => { return "translate( " + ((i * 10) + 3) + ", 340)rotate(-90)"});
    
    bars
        .append("text")
        .attr("class", "value")
        .text((d) => {
          return d["TIME ENTERED"].substring(0,4);
        })
        .attr("x", (d,i) => (i * 10) - 2)
        .attr("y", (d,i) => 300 - d["TIME ENTERED"] - 10)
        .attr("font-size", "4px");

    */

  }

  render() {
    return (
      <div id="BarContainer">
        
      </div>
    )     
  }
}

export default BarChart;













