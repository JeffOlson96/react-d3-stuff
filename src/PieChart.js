import React from 'react';
import { Component } from 'react';
import res from './res.csv';
import * as d3 from 'd3';
import scale from 'd3-scale';






class PieChart extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      depth: 0,
      saveIdx: 0
    };
    this.drawChart = this.drawChart.bind(this);
    
  }

  componentDidMount() {
    
    this.setState({data: this.props.data});
    
  }
  componentDidUpdate() {
    //console.log(this.props.data);
    //
    this.drawChart(this.props.data);
  }
  
  drawChart(data) {
    //this.setState({data: this.props.data});
    this.state.data = this.props.data;
    console.log("state: ", this.state);
    console.log("Beg: ", data);
    if (data.length > 0) {
      var scope = this;    
      var radius = Math.min(1000, 500) / 2;
      //var depth = 0;
      

      var color = d3.scaleOrdinal()
            .domain(data)
            .range(d3.schemeSet3);

      var arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 80);

      var labelArc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);


      var pie = d3.pie()
            .sort(null)
            .value((d) => {
              return d.value;
            });

      // base svg set up
      const svg = d3.select("#container")
            .append("svg")
            .attr("class", "pie")
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
            //scope.props.onChangeValue(d);
            
            if (curDepth === 1) {
              scope.setState({depth: curDepth-=1});
              d3.selectAll(".pie").remove();
              scope.drawChart(scope.state.data);
            }
            else if (curDepth === 2) {
              let idx = scope.state.saveIdx;
              scope.setState({depth: curDepth-=2});
              d3.selectAll(".pie").remove();
              //console.log("Check: ", scope.state.data[idx]);
              scope.drawChart(scope.state.data);
            }
            
          });

      // g groups for holding data
      var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");
      //console.log("ARC ", data);
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
          .on("click", function(d, i) {
            console.log("CLICKval: ", d);
            scope.props.onChangeValue(d);
            scope.setState({depth: scope.state.depth+=1});
            if (scope.state.depth < 2) {
              scope.setState({saveIdx: i});
            }
            if (d.data.children) {
              d3.selectAll(".pie").remove();
              scope.drawChart(d.data.children);
            }
            else if (d.data.values) {
              d3.selectAll(".pie").remove();
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
          .attr("font-size", "8px");
          /*
          .attr("transform", function(d) { 
            var midAngle = d.endAngle < Math.PI ? d.startAngle/2 + d.endAngle/2 : d.startAngle/2  + d.endAngle/2 + Math.PI ;
            return "translate(" + labelArc.centroid(d)[0] + "," + labelArc.centroid(d)[1] + ") rotate(" + (midAngle * 180/Math.PI) + ")"; })
          .attr("dy", ".35em");
          */
      
      /*
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
        */
      }
  }

  render() {
    return (
      <div id="container" onChange={this.props.onChangeValue}>
        
      </div>
    )     
  }
}

export default PieChart;













