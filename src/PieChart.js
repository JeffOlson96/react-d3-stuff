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
      depth: 0
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
      scope.setState({data: dubSend});
      scope.drawChart(dubSend);
    });
    
  }
  
  drawChart(data) {
    console.log(this.state);
    console.log(data);
    
    var scope = this;    
    var radius = Math.min(1000, 400) / 2;
    //var depth = 0;
    

    var color = d3.scaleOrdinal()
          .domain(data)
          .range(d3.schemeSet3);

    var arc = d3.arc()
          .outerRadius(radius - 10)
          .innerRadius(radius - 70);

    var labelArc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 70);


    var pie = d3.pie()
          .sort(null)
          .value((d) => {
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
        .on("click", function(d, i) {
          var curDepth = scope.state.depth;
          if (curDepth === 1) {
            scope.setState({depth: curDepth-=1});
            d3.select("svg").remove();
            scope.drawChart(scope.state.data);
          }
          else if (curDepth === 2) {
            scope.setState({depth: curDepth-=1});
            d3.select("svg").remove();
            console.log("Check: ", scope.state.data);
            //scope.drawChart(scope.state.data.children[i]);
          }
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
          if (d.data) {
            return color(d.data.key);
          }
          else if (d.key) {
            return color(d.key);
          }
          
        })
        .on("click", function(d) {
          console.log("CLICKval: ", d);
          scope.setState({depth: scope.state.depth+=1});
          if (d.data.children) {
            d3.select("svg").remove();
            scope.drawChart(d.data.children);
          }
          else if (d.data.values) {
            d3.select("svg").remove();
            scope.drawChart(d.data.values);
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
              coord[0] *= 0.90;
              coord[1] *= 0.90;
              return "translate(" + coord + ")";
            })
            .text(function() {
              return Math.ceil(d.data.value) + " hrs";
            })
            .attr("font-size", "9px")
            .style("text-anchor", "middle")
            .style("font-weight", "lighter");
        })
        .on("mouseout", function(d) {
          d3.select(this)
              .style("opacity", 1.0);
          d3.select(this).style("fill", function(d) {
            return color(d.data.key);
          });
          d3.selectAll('.val').remove();
        });

    // append texts appropriately
    /*
    g.append("text")
        .attr("transform", function(d, i) {
          //console.log(arc.centroid(d), " : ", d);
          let coord = arc.centroid(d);
          coord[0] *= 1.40;
          coord[1] *= 1.40;
          return "translate(" + coord +")";
          
        })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) {
          if (d.data) {
            return d.data.key;
          }
          else if (d.key) {
            return d.key;
          }
        })
        .attr("font-size", "8px");   
        */
    
    /* DOES THE SAME THING ^^ BUT HAS MATH BEHIND arc.centroid */
    g.append("text")
        .attr("text-anchor", "middle")
        .attr("x", function(d) {
          var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
          d.cx = Math.cos(a) * (radius - 45);
          return d.x = Math.cos(a) * (radius + 30);
        })
        .attr("y", function(d) {
          var b = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
          d.cy = Math.sin(b) * (radius - 45);
          return d.y = Math.sin(b) * (radius + 30);
        })
        .text(function(d) {
          var curAngle = d.endAngle - d.startAngle;
          if (curAngle > 0.07) { 
            d.textSet = true;
            if (d.data) {
              return d.data.key;
            }
            else if (d.key) {
              return d.key;
            }
          }
          
        })
        .each(function(d) {
          var box = this.getBBox();
          d.sx = d.x - box.width/2 - 2;
          d.ox = d.x + box.width/2 + 2;
          d.sy = d.oy = d.y + 5;
        })
        .attr("font-size", "7px");
        /*
        .attr("transform", function(d) { 
          var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
          return "translate(" + labelArc.centroid(d)[0] + "," + labelArc.centroid(d)[1] + ") rotate(" + (midAngle * 180/Math.PI) + ")"; })
        .attr("dy", ".35em");
        */
    

    g.append("path")
      .attr("class", "pointer")
      .style("fill", "none")
      .style("stroke", "black")
      .attr("d", function(d) {
        //console.log(d);
        if (d.textSet === true) {
          if (d.cx > d.ox) {
            return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
          }
          else {
            return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
          }
        }
      })
      .style("opacity", 0.5);
      
  }

  render() {
    return (
      <div id="BarChart">
        
      </div>
    )     
  }
}

export default BarChart;













