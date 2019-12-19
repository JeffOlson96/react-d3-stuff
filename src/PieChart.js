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

    d3.csv(res).then(function(data) {
      // simple nest to group objects by department description and sum their time values
      var send = d3.nest()
          .key(function(d) {
            return d["DEPARTMENT DESCRIPTION"];
          })
          .rollup(function(d) {
            return d3.sum(d, function(v) {
              return v["TIME ENTERED"];
            });
          }).entries(data);


      /* old, for regular processing, fullData
      data.forEach((val, idx) => {
        //console.log(val)
        if (val["DEPARTMENT DESCRIPTION"] !== "EH Employees:") {
          FullData.push(val);
        }
      });
      */
      //console.log(send);
      scope.drawChart(send);
    });
    
  }
  
  drawChart(data) {
    //console.log(data);
    
    //var info = Array(571);
    
    //console.log(info);
    const info = [12, 5, 6, 8, 3];
    




    var radius = Math.min(1000, 400) / 2;
    

    var color = d3.scaleOrdinal()
          .domain(data)
          .range(d3.schemeSet3);

    var arc = d3.arc()
          .outerRadius(radius - 10)
          .innerRadius(radius - 70);


    var pie = d3.pie()
          .sort(null)
          .value(function(d) {
            return d.value;
          });

    const svg = d3.select("#root")
          .append("svg")
          .attr("width", 1000)
          .attr("height", 600)
          .append("g")
          .attr("transform", "translate(" + 500 + "," + 300 + ")");

    var g = svg.selectAll(".arc")
          .data(pie(data))
          .enter().append("g")
          .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) {
          return color(d.data.key);
        })
        .on("click", function(d) {
          console.log(d);
        })

    g.append("text")
        .attr("transform", function(d, i) {
          //console.log(arc.centroid(d), " : ", d);
          
          let coord = arc.centroid(d);
          coord[0] *= 1.40;
          coord[1] *= 1.40;
          //return "translate(" + coord + ")";
          
          return "translate(" + coord +")"; 
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) {
          return d.data.key;
        })
        .attr("font-size", "4px")
        .on("mouseover", (d) => {
          //console.log("HOVERval: ", d)
        })
        .on("click", (d) => {
          console.log("CLICKval: ", arc.centroid(d))
        });    

  }

  render() {
    return (
      <div id="BarChart">
        
      </div>
    )     
  }
}

export default BarChart;













