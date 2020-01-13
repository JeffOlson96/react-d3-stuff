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
          if (v.baseDept === d.key) {
            d.children.push(v);
          }
        })
      });
      
      scope.setState({data: dubSend});
      scope.drawChart(dubSend);
    });
    
  }
  
  drawChart(data) {
    console.log(data);
    var info = data;
    var scope = this;    
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

    // base svg set up
    const svg = d3.select("#BarChart")
          .append("svg")
          .attr("width", 1000)
          .attr("height", 600)
          .append("g")
          .attr("transform", "translate(" + 500 + "," + 300 + ")");
    
    // back button in the middle
    svg.append("text")
        .style("text-anchor", "middle")
        .text("BACK")
        .on("click", function(d) {
          d3.select("svg").remove();
          scope.drawChart(scope.state.data);
        });

    // g groups for holding data
    var g = svg.selectAll(".arc")
          .data(pie(data))
          .enter().append("g")
          .attr("class", "arc");

    // g append paths and fill with stuff, with click functionality
    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) {
          return color(d.data.key);
        })
        .on("click", function(d) {
          //console.log("CLICKval: ", arc.centroid(d));
          if (d.data.children) {
            d3.select("svg").remove();
            scope.drawChart(d.data.children);
          }
        })
        .on("mouseover", function(d) {
          d3.select(this).attr("class", "highlight");
          d3.select(this)
              .style("opacity", 0.5);
          g.append("text")
            .attr('class', 'val')
            .attr("transform", function() {
              let coord = arc.centroid(d);
              return "translate(" + coord + ")";
            })
            .text(function() {
              return Math.ceil(d.data.value) + " hrs";
            })
            .attr("font-size", "10px")
            .style("text-anchor", "middle");
        })
        .on("mouseout", function(d) {
          d3.select(this)
              .style("opacity", 1.0);
          d3.select(this).style("fill", function(d) {
            return color(d.data.key);
          });
          d3.selectAll('.val').remove();
        })

    // append texts appropriately 
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
        .attr("font-size", "6px");   

  }

  render() {
    return (
      <div id="BarChart">
        
      </div>
    )     
  }
}

export default BarChart;













