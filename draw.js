var gradesData;

d3.csv("grades.csv", function(data) {
gradesData = data;

// Parse the data and convert strings to numbers
gradesData.forEach(function(d) {
d.Quarter = +d.Quarter;
d.Course_Level2 = +d.Course_Level2;
d.Course = +d.Course;
d.Instructor = +d.Instructor;
d.Grade_Given = +d.Grade_Given;
d.Sum_of_Student_Count = +d.Sum_of_Student_Count;
});

// Set up scales and axes
var x = d3.scaleLinear()
.domain([0, d3.max(gradesData, function(d) { return d.Quarter; })])
.range([0, width]);
var y = d3.scaleLinear()
.domain([0, d3.max(gradesData, function(d) { return d.Grade_Given; })])
.range([height, 0]);
var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);

// Add axes to the chart
svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(xAxis);
svg.append("g")
.attr("class", "y axis")
.call(yAxis);

// Add the data points to the chart
svg.selectAll(".dot")
.data(gradesData)
.enter().append("circle")
.attr("class", "dot")
.attr("r", 3.5)
.attr("cx", function(d) { return x(d.Quarter); })
.attr("cy", function(d) { return y(d.Grade_Given); });
});


