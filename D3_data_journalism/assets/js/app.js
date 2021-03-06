// ******************************************************************************
// **   D3 Homework - Data Journalism and D3
// **
// **      Author: George Alonzo
// **    Due Date: December 28, 2021
// **
// ******************************************************************************

var svgWidth = 960;
var svgHeight = 650;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };
  
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
  
// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .style("background","whitesmoke");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(inputData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    inputData.forEach(function(obj) {
        obj.poverty = +obj.poverty;
        obj.healthcare =+ obj.healthcare;
      });

        
    // Step 2: Create scale functions
    // ==============================  
    var xLinearScale = d3.scaleLinear()
      .domain([8.5, d3.max(inputData, o => o.poverty +2)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([3,d3.max(inputData, d => d.healthcare +4)])
      .range([height, 0]);


    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);   

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);    

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(inputData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "steelblue")
      .attr("opacity", ".75");    


    // Step 5b: Include State Abbreviations in Circles
    // ==============================
    var circleLabels = chartGroup
      .selectAll(null)
      .data(inputData)
      .enter()
      .append("text");

    circleLabels
      .attr("x", function(d) {
        return xLinearScale(d.poverty);
        })
      .attr("y", function(d) {
        return yLinearScale(d.healthcare);
        })
      .text(function(d) {
        return d.abbr;
        })
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("fill", "white");    

    // Create X & Y labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
    }).catch(function(error) {
        console.log(error);    
});