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
import Sunburst from "./SunburstComponent.js";




class PBIApp extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      send: [],
      depth: 0,
      saveIdx: 0
    };
    this.handleDataChange = this.handleDataChange.bind(this);
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
      scope.setState({data: dubSend, send: dubSend});      
    });
    
  }
  
  handleDataChange = (e) => {
    console.log("Changing: ", e);
    
    if (e === this.state.send || e.data === this.state.send) {
      //console.log("caught");
      this.setState({send: this.state.data});
    }
    else {
      if (e.data) {
        this.setState({send: e.data});
      }
      else if (e.length > 0) {
        this.setState({send: e});
      }
    }
    
    //console.log("after: ", this.state.data);
  }

  
  render() {
    //console.log("App Render: ", this.state.send);
    var d = this.state.send;
    return (
      <div id="Full" width="500">
        {this.state.send ?
          <PieChart 
            data={d}
            onChangeValue={this.handleDataChange}
          />
          : null
        }
        {this.state.send ?
          <BarChart 
            data={d}
            onChangeValue={this.handleDataChange}
          />
          : null
        } 
      </div>
    )     
  }
}


/*
{this.state.send ?
          <SideBarChart 
            data={d}
            onChangeValue={this.handleDataChange}
          />
          : null
        }

<Sunburst/>


<SideBarChart/>
<div id="Pie">
          <PieChart/>
        </div>

<AudioComponent/>
*/
export default PBIApp;













