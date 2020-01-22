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
    var FullData = new Array();
    var scope = this;
    var obj = {};
    d3.csv(res).then(function(data) {
      // simple nest to group objects by department description and sum their time values
      var send = d3.nest()
          .key(function(d) {
            return d["DEPARTMENT DESCRIPTION"];
          })
          .key(function(d) {
            return d["NAME"];
          })
          .rollup(function(d) {
            return d3.sum(d, function(v) {
              return v["TIME ENTERED"];
            });
          })
          .entries(data);


      /* old, for regular processing, fullData
      data.forEach((val, idx) => {
        //console.log(val)
        if (val["DEPARTMENT DESCRIPTION"] !== "EH Employees:") {
          FullData.push(val);
        }
      });
      */
      // can re format also to try to get the base department
      
      
      send.forEach((d,i) => {
        d.baseDept = d.key.substring(0,3);
      });

      var dubSend = d3.nest()
          .key(function(d) {
            return d.baseDept;
          })
          .rollup(function(d) {
            return d3.sum(d, function(v) {
              return v.value;
            })
          })
          .entries(send);
      

      dubSend.forEach((d,i) => {
        d.children = [];
        send.forEach((v) => {
          //console.log(v);
          if (v.baseDept === d.key) {
            d.children.push(v);
          }
        })
      });
      
      dubSend.forEach((d) => {
        var totVal = 0;
        //console.log(d);
        d.children.forEach((child) => {
          child.value = 0;
          child.values.forEach((grandchild) => {
            //console.log(grandchild);
            child.value += grandchild.value;
            totVal += grandchild.value;
          })
        })
        d.value = totVal;
      });
      //scope.setState({data: dubSend});
      scope.drawChart(dubSend);
    });
    
  }
  
  drawChart(data) {
    console.log(data);
    var info = data;
    var scope = this;
    var radius = Math.min(1000, 400) / 2;
    var root = d3.tree(data);
    //root.each(d => d.current = d);
    //console.log(root);

    // Set up, initialization
    var color = d3.scaleOrdinal()
          .domain(data)
          .range(d3.schemeSet3);

    var margin = {top: 20, right: 20, bottom: 30, left: 100},
      width = 1000 - margin.left - margin.right,
      height = 1050 - margin.top - margin.bottom;
    
    
    var arc = d3.arc()
          .outerRadius(radius - 10)
          .innerRadius(radius - 70);

    var svg = d3.select("#Full").append("svg")
          .attr("class", "SunBurst")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

    
    const path = g.append("g")
        .selectAll("path")
        .data(data)
        .join("path")
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.key); })
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("d", d => arc(d.current));

    path.filter(d => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    path.append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${d.value}`);

    const label = g.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .text(d => d.data.name);

    const parent = g.append("circle")
        .datum(root)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("click", clicked);
    
    function clicked(p) {

      parent.datum(p.parent || root);
      root.each(d => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      });

      const t = g.transition().duration(750);

      // Transition the data on all arcs, even the ones that aren’t visible,
      // so that if this transition is interrupted, entering arcs will start
      // the next transition from the desired position.
      path.transition(t)
          .tween("data", d => {
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
          })
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
          .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
          .attrTween("d", d => () => arc(d.current));

      label.filter(function(d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
          .attr("fill-opacity", d => +labelVisible(d.target))
          .attrTween("transform", d => () => labelTransform(d.current));   
      
    }
    function arcVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

  }

  render() {
    return (
      <div id="BarChart">
        
      </div>
    )     
  }
}

export default BarChart;













