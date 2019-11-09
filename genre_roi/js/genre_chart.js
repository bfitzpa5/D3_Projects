var margin = { left:80, right:20, top:50, bottom:100 };

var width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// X Label
g.append("text")
    .attr("y", height + 90)
    .attr("x", width / 2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Genre");

// Y Label
g.append("text")
    .attr("y", -60)
    .attr("x", -(height / 2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Return on Investment");

d3.csv("data/genre_roi.csv").then(function(data){
    // console.log(data);

    // Clean data
    data.forEach(function(d) {
        d.roi = +d.roi;
    });

    // X Scale
    var x = d3.scaleBand()
        .domain(data.map(function(d){ return d.genre }))
        .range([0, width])
        .padding(0.2);

    // Y Scale
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.roi })])
        .range([height, 0]);

    // X Axis
    var xAxisCall = d3.axisBottom(x);
    g.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height +")")
        .call(xAxisCall)
      .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Y Axis
    var yAxisCall = d3.axisLeft(y)
        .tickFormat(function(d){ return d * 100 + '%'; });
    g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);

    // Bars
    var rects = g.selectAll("rect")
        .data(data)

    rects.enter()
        .append("rect")
            .attr("y", function(d){ return y(d.roi); })
            .attr("x", function(d){ return x(d.genre) })
            .attr("height", function(d){ return height - y(d.roi); })
            .attr("width", x.bandwidth)
            .attr("fill", "grey");
})
