import React from 'react';
import { Component } from 'react';
import res from './res.csv';
import * as d3 from 'd3';
import scale from 'd3-scale';






class SideBarChart extends Component {
  
  constructor() {
    super();

    this.state = {
      data: [],
      depth: 0
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
    var data2 = data;
    if (data2.length > 0) {
      var scope = this;
      var info = Array(571);
      //var margin = 50;
      var margin = {top: 20, right: 20, bottom: 30, left: 100},
        width = 1000 - margin.left - margin.right,
        height = 1050 - margin.top - margin.bottom;
      
      //console.log(info);
      //const info = [12, 5, 6, 8, 3];
      //const svg = d3.select("#root").append("svg").attr("width", width).attr("height", height);
      
      var svg = d3.select("#root").append("svg")
                .attr("class", "BBB")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", 
                      "translate(" + margin.left + "," + margin.top + ")");

      svg.append("text")
          .style("text-anchor", "middle")
          .text("BACK")
          .on("click", function(d, i) {
            var curDepth = scope.state.depth;
            if (curDepth === 1) {
              scope.setState({depth: curDepth-=1});
              d3.select(".BBB").remove();
              scope.drawChart(scope.state.data);
            }
            else if (curDepth === 2) {
              scope.setState({depth: curDepth-=2});
              d3.select(".BBB").remove();
              console.log("Check: ", scope.state.data);
              //scope.drawChart(scope.state.data.children[i]);
            }
          });

      
      data2.sort((a,b) => {
        return a.value-b.value;
      });
      

      var x = d3.scaleLinear()
              .range([0, 1000]);

      var color = d3.scaleOrdinal()
                .domain(data2)
                .range(d3.schemeSet3);



      var y = d3.scaleBand()
                .range([1000, 0])
                .padding(0.1);

      x.domain([0, d3.max(data2, function(d){ return d.value + 1000; })]);
      y.domain(data2.map(function(d) { return d.key}));

      
      var bars = svg.selectAll('.bar')
          .data(data2)
          .enter()
          .append("g");


      bars.append("rect")
          .attr("class", "bar")
          .attr("x", 0)
          .attr("y", (d, i) => {return y(d.key)}) // 300 is height, can be made more dynamic with variables, state to hold info
          .attr("width", (d) => {return x(d.value)})
          .attr("height", y.bandwidth())
          .attr("fill", function(d) {return color(d.key)})
          .on("click", (d, i) => {
            //console.log(d);
            if (d.children) {
              scope.setState({depth: scope.state.depth+=1});
              d3.selectAll(".BBB").remove();
              scope.drawChart(d.children);
            }
          })
          .on("mouseover", function(d) {
            d3.select(this).attr("class", "highlight");
            d3.select(this)
                .style("opacity", 0.5);
            bars.append("text")
              .attr('class', 'val')
              .attr("transform", function() {
                //let coord = arc.centroid(d);
                return "translate(300 , 0)";
              })
              .text(function() {
                return Math.ceil(d.value) + " hrs";
              })
              .attr("font-size", "10px")
              .style("text-anchor", "middle");
          })
          .on("mouseout", function(d) {
            d3.select(this)
                .style("opacity", 1.0);
            d3.select(this).style("fill", function(d) {
              return color(d.key);
            });
            d3.selectAll('.val').remove();
          });


      svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));

      svg.append("g").call(d3.axisLeft(y)).attr("font-size", "8px");

      /*
      
      
      bars
          .append("text")
          .attr("class", "value")
          .text((d) => {
            return d.value;
          })
          .attr("x", (d,i) => ((i * 10) - 2) + margin)
          .attr("y", (d,i) => 420 - (d.value * 0.5) - 10)
          .attr("font-size", "4px");
        */
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
  }

  render() {
    return (
      <div id="SideBarChart">
        
      </div>
    )     
  }
}

export default SideBarChart;













