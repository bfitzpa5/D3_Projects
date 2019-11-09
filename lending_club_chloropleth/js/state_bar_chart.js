var lowColor = '#bc2a66'
var highColor = '#2abc89'

var margin = {
  left: 100,
  right: 100,
  top: 10,
  bottom: 10,
}

var chartWidth = 600
var chartHeight = 400
var width = chartWidth - margin.left - margin.right;
var height = chartHeight - margin.top - margin.bottom;

var svg = d3.select("#bar-chart-area")
  .append("svg")
  .attr("width", chartWidth)
  .attr("height", chartHeight)

d3.csv("data/statesdata.csv", function(data){
  var dataArray = [];
  data.forEach(d => {
    d.total_loans = +d.total_loans;
    dataArray.push(d.total_loans);
  });

  var minVal = d3.min(dataArray);
  var maxVal = d3.max(dataArray);
  var ramp = d3.scaleLinear().domain([minVal, maxVal]).range([lowColor, highColor]);

  var x = d3.scaleBand()
    .domain(data.map(function(d){
      return d.state;
    }))
    .range([0, width])
    .paddingInner(0.2)
    .paddingOuter(0.3)

  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
      return d.total_loans;
    })])
    .range([height, 0])

  var rects = svg.selectAll("rect")
    .data(data)

  rects.enter()
    .append("rect")
    .attr("y", function(d) { return y(d.total_loans); })
    .attr("x", function(d) { return x(d.state); })
    .attr("height", function(d) { return height - y(d.total_loans); })
    .attr("width", x.bandwidth)
    .style("fill", function(d) { return ramp(d.total_loans) });

});
