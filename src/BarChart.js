import React from 'react';
import { Component } from 'react';
import res from './res.csv';
import * as d3 from 'd3';
import scale from 'd3-scale';






class BarChart extends Component {
  
  constructor() {
    super();

    this.state = {
      data: [],
      depth: 0,
      clicked: null
    };
    this.drawChart = this.drawChart.bind(this);
    
  }
  componentDidMount() {
    
    this.setState((props) => ({data: this.props.data}));
    this.drawChart(this.props.data);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState((props) => ({data: this.props.data}));
      d3.selectAll(".bar").remove();
      this.drawChart(this.props.data);
    }
  }

  componentWillUnmount() {
    d3.selectAll(".bar").remove();
  }
  
  drawChart(data) {
    
    if (data.length > 0) {
      //console.log("BarChart: ", data);
      var multiplyFactor = 0.1;

      var dataMax, dataMin;

      function getVals() {
        if (data.children) {
          return data.children.map(d => d.value);
        }
        //else if (data.values) {
        //  return data.values.map(d => d.value);
        //}
        else {
          return data.map(d => d.value);
        }
      }
      function getMin() {
        return Math.min(...getVals());
      }
      function getMax() {
        return Math.max(...getVals());
      }

      dataMax = getMax();
      dataMin = getMin();
      
      //console.log(dataMax, ":", dataMin);
      let diff = dataMax - dataMin;
      if (diff > 2000) {
        multiplyFactor = 0.1;
      }
      else if (2000 > diff >= 100) {
        multiplyFactor = 2.0;
      }
      else if (diff <= 100) {
        multiplyFactor = 3.0;
      }

      if (data.children) {
        data = data.children;
      }
      else if (data.parent) {
        data = data.values;
      }
      
      var info = Array(571);
      var margin = 50;
      
      //console.log(info);
      //const info = [12, 5, 6, 8, 3];
      const svg = d3.select("#BarContainer")
                    .append("svg")
                    .attr("width", 1500)
                    .attr("height", 800)
                    .attr("class", "bar");
      
      // using scale band for bars
      var x = d3.scaleBand()
              .range([0, 1500])
              .domain(data.map(function(d) {return d.key;}))
              .padding(0.2);
      
      
      // scale Ordinal is helpful for colors
      var color = d3.scaleOrdinal()
                .domain(data)
                .range(d3.schemeSet3);


      // y = mx + b
      var y = d3.scaleLinear()
                .range([0, 800]);

      y.domain(data.map(function(d) { return d.key}));

      
      var bars = svg.selectAll('.bars')
          .data(data)
          .enter()
          .append("g");


      bars.append("rect")
          .attr("class", "bars")
          .attr("x", (d, i) => (i * 15) + margin)
          .attr("y", (d, i) => 550 - (d.value * multiplyFactor)) // 300 is height, can be made more dynamic with variables, state to hold info
          .attr("width", 10)
          .attr("height", (d, i) => {
            return d.value * multiplyFactor;
          })
          .attr("fill", function(d) {
            d.parent = data;
            return color(d.key)
          })
          .on("mouseover", function(d) {
            d3.select(this)
              .style("opacity", 0.5);
          })
          .on("mouseout", function(d) {
            d3.select(this)
                .style("opacity", 1.0);
            d3.select(this).style("fill", function(d) {
                return color(d.key);
              });
          });


      bars.append("text")
          .attr("class", "label")
          .text((d) => {
            return d.key;
          })
          .attr("font-size", "8px")
          .attr("transform", (d,i) => { return "translate( " + (((i * 15) + 9) + margin) + "," + ((d.key.length * 5) + 570) + ")rotate(-90)"});
      
      bars
          .append("text")
          .attr("class", "value")
          .text((d) => {
            return Math.ceil(d.value);
          })
          .attr("x", (d,i) => ((i * 15) - 0) + margin)
          .attr("y", (d,i) => 550 - (d.value * multiplyFactor) - 10)
          .attr("font-size", "8px");

      svg.append("g").call(d3.axisLeft(y)).attr("font-size", "7px");
    }
    else if (data.children) {
      this.drawChart(data.children);
    }
    else if (data.values) {
      this.drawChart(data.values);
    }
  }

  render() {
    return (
      <div id="BarContainer">
        
      </div>
    )     
  }
}

export default BarChart;













