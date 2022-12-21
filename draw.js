function findCourse(da,quarter,courseLevel,course,instructor){
  var course = da.filter(function(d){
      return d.quarter == quarter && d.courseLevel == courseLevel && d.course == course && d.instructor == instructor
  })
  return course
}

function findProfessor(da,instructor){
  var course = da.filter(function(d){
      return  d.instructor == instructor;
  })
  return course
}

function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
          callback(rawFile.responseText);
      }
  }
  rawFile.send(null);
}

function searchProfessor(){
  var instructor = document.getElementById('instructor').value;
  readTextFile("./courses.json", function(text){
  var data = JSON.parse(text);
  const options = {
    // isCaseSensitive: false,
    // includeScore: false,
    shouldSort: true,
    includeMatches: true,
    findAllMatches: true,
    minMatchCharLength: 2,
    // location: 0,
     threshold: 0.6,
    //distance: 5,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    //limit:50,
    keys: [
      "Instructor"
    ]
  };
  
  const fuse = new Fuse(data, options);
  if (courseNumber==""){
    var result = fuse.search({
      $or: [{ Course: course }, { Instructor: instructor },{ Quarter: quarter },{ Course_Level: courseLevel}]
    });
  }else if (dept != ""){
    var result = fuse.search({
      $and:[ {Department: "^"+dept},{Course_Number: courseNumber}]
    });
  }
  else{
    var result = fuse.search({
    $and:[ {Course_Number: "\="+courseNumber},
    {$or: [{ Course: course }, { Instructor: instructor },{ Quarter: quarter },{ Course_Level: courseLevel}]}
    ]
  });
  }

  const MAXDISPLAYNUM = 50;

  if (result.length == 0){
    $("#cards").html("No result found");
  }
  else{
    $("#cards").html("");
    for (var i = 0; i <= MAXDISPLAYNUM; i++){
      $("#cards").html($('#cards').html() + "<div class=\"column\"><div class=\"card\"><p id = \"card"+i+"\">" + result[i].item.Quarter + ", " +  result[i].item.Course_Level + ", " + result[i].item.Course  + ", " + result[i].item.Instructor + "</p>"+ "<input type=\"button\" value=\"Render\" onclick=\"drawCourse("+ "\'"+result[i].item.Quarter+ "\'"+ "," +"\'"+result[i].item.Course_Level+ "\'"+"," +"\'"+result[i].item.Course+ "\'"+"," +"\'"+result[i].item.Instructor+ "\'"+")\" />" +"</div></div>");
    }
  }
});
}

function searchCourse(){
  var quarter = document.getElementById('quarter').value;;
  var courseLevel = document.getElementById('course-level').value;
  var dept = document.getElementById('dept').value;
  var courseNumber = document.getElementById('course-number').value;
  var course = dept + " " + courseNumber;
  var instructor = document.getElementById('instructor').value;
  readTextFile("./courses.json", function(text){
  var data = JSON.parse(text);
  const options = {
    // isCaseSensitive: false,
    // includeScore: false,
     shouldSort: true,
     includeMatches: true,
     findAllMatches: true,
    minMatchCharLength: 2,
    // location: 0,
     threshold: 0.6,
    //distance: 5,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    //limit:50,
    keys: [
      "Course", "Instructor", "Quarter", "Course_Level","Department","Course_Number"
    ]
  };
  
  const fuse = new Fuse(data, options);
  if (courseNumber==""){
    var result = fuse.search({
      $or: [{ Course: course }, { Instructor: instructor },{ Quarter: quarter },{ Course_Level: courseLevel}]
    });
  }else if (dept != ""){
    var result = fuse.search({
      $and:[ {Department: "^"+dept},{Course_Number: courseNumber}]
    });
  }
  else{
    var result = fuse.search({
    $and:[ {Course_Number: "\="+courseNumber},
    {$or: [{ Course: course }, { Instructor: instructor },{ Quarter: quarter },{ Course_Level: courseLevel}]}
    ]
  });
  }

  const MAXDISPLAYNUM = 50;

  if (result.length == 0){
    $("#cards").html("No result found");
  }
  else{
    $("#cards").html("");
    for (var i = 0; i <= MAXDISPLAYNUM; i++){
      $("#cards").html($('#cards').html() + "<div class=\"column\"><div class=\"card\"><p id = \"card"+i+"\">" + result[i].item.Quarter + ", " +  result[i].item.Course_Level + ", " + result[i].item.Course  + ", " + result[i].item.Instructor + "</p>"+ "<input type=\"button\" value=\"Render\" onclick=\"drawCourse("+ "\'"+result[i].item.Quarter+ "\'"+ "," +"\'"+result[i].item.Course_Level+ "\'"+"," +"\'"+result[i].item.Course+ "\'"+"," +"\'"+result[i].item.Instructor+ "\'"+")\" />" +"</div></div>");
    }
  }
});
}

function clearSearch(){
  $("#cards").html("");
};

function clearRender(){
  $("#graphs").html("");
}

function BarChart(data, {
  x = (d, i) => i, // given d in data, returns the (ordinal) x-value
  y = d => d, // given d in data, returns the (quantitative) y-value
  title, // given d in data, returns the title text
  marginTop = 20, // the top margin, in pixels
  marginRight = 0, // the right margin, in pixels
  marginBottom = 30, // the bottom margin, in pixels
  marginLeft = 40, // the left margin, in pixels
  width = 640, // the outer width of the chart, in pixels
  height = 400, // the outer height of the chart, in pixels
  xDomain, // an array of (ordinal) x-values
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // y-scale type
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  xPadding = 0.1, // amount of x-range to reserve to separate bars
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  color = "currentColor" // bar fill color
} = {}) {
  // Compute values.
  var X = d3.map(data, x);
  var Y = d3.map(data, y);

  // Reorder X, Y
  var newX = [];
  var newY = [];
  const possibleGrades = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F","P","NP"];
  for (var j = 0; j < possibleGrades.length; j++){
    for (var i = 0; i < X.length; i++){
      if (X[i] == possibleGrades[j]){
        newX.push(X[i]);
        newY.push(Y[i]);
      }
    }
  }
  // Reassign X, Y
  X = newX;
  Y = newY;


  // Compute default domains, and unique the x-domain.
  if (xDomain === undefined) xDomain = X;
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];
  xDomain = new d3.InternSet(xDomain);

  // Omit any data not present in the x-domain.
  const I = d3.range(X.length).filter(i => xDomain.has(X[i]));

  // Construct scales, axes, and formats.
  const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

  // Compute titles.
  if (title === undefined) {
    const formatValue = yScale.tickFormat(100, yFormat);
    title = i => `${X[i]}\n${formatValue(Y[i])}`;
  } else {
    const O = d3.map(data, d => d);
    const T = title;
    title = i => T(O[i], i, data);
  }

  // Calculate GPA
  var sumOfStudent = 0;
  var sumOfGPA = 0;
  for (var i = 0; i < Y.length; i++){
    sumOfStudent += Y[i];
    if (X[i] == "A" || X[i] == "A+"){
      sumOfGPA += Y[i]*4;
    }
    else if(X[i] == "A-"){
      sumOfGPA += Y[i]*3.7;
    }
    else if(X[i] == "B+"){
      sumOfGPA += Y[i]*3.3;
    }
    else if(X[i] == "B"){
      sumOfGPA += Y[i]*3;
    }
    else if(X[i] == "B-"){
      sumOfGPA += Y[i]*2.7;
    }
    else if(X[i] == "C+"){
      sumOfGPA += Y[i]*2.3;
    }
    else if(X[i] == "C"){
      sumOfGPA += Y[i]*2;
    }
    else if(X[i] == "C-"){
      sumOfGPA += Y[i]*1.7;
    }
    else if(X[i] == "D+"){
      sumOfGPA += Y[i]*1.3;
    }
    else if(X[i] == "D"){
      sumOfGPA += Y[i]*1;
    }
    else if(X[i] == "D-"){
      sumOfGPA += Y[i]*0.7;
    }
    else if(X[i] == "F"){
      sumOfGPA += Y[i]*0;
    }
  }
  var GPA = sumOfGPA/sumOfStudent;
  GPA = GPA.toFixed(3);

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel)); 

  const bar = svg.append("g")
      .attr("fill", color)
    .selectAll("rect")
    .data(I)
    .join("rect")
      .attr("x", i => xScale(X[i]))
      .attr("y", i => yScale(Y[i]))
      .attr("height", i => yScale(0) - yScale(Y[i]))
      .attr("width", xScale.bandwidth());

  if (title) bar.append("title")
      .text(title);

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

  svg.append("text")
      .attr("x", (width / 2))             
      .attr("y", 20)
      .attr("text-anchor", "middle")  
      .style("font-size", "14px") 
      .text(data[0].quarter + "," + data[0].courseLevel + "," + data[0].course + "," + data[0].instructor); 

  svg.append("text")
      .attr("x", (width / 2)+40)             
      .attr("y", 40)
      .attr("text-anchor", "middle")  
      .style("font-size", "14px") 
      .text("Average GPA: " + GPA);
      
  return svg.node();
};


function drawProfessor(instructor) {

  //loading the data
  // Quarter,Course_Level,Course,Instructor,Grade_Given,Sum_of_Student_Count
  d3.csv("grades2.csv",function(d){
      return {
          quarter: d.Quarter,
          courseLevel: d.Course_Level,
          course: d.Course,
          instructor: d.Instructor,
          grade: d.Grade_Given,
          studentCount: +d.Sum_of_Student_Count,
          courseNumber: d.Course_Number,
          department: d.Department
      }
  }).then(function(data){
    var target = findProfessor(data,instructor);
    console.log(target)
    /*
    chart = BarChart(target, {
      x: d => d.grade,
      y: d => d.studentCount,
      yLabel: "#Student",
      width: 500,
      height: 300,
      color: "steelblue"
    });

    //append the chart to the body of the html page
    document.getElementById("graphs").appendChild(chart);
    */
  });
}


function drawCourse(quarter,courseLevel,course,instructor) {

  //loading the data
  // Quarter,Course_Level,Course,Instructor,Grade_Given,Sum_of_Student_Count
  d3.csv("grades2.csv",function(d){
      return {
          quarter: d.Quarter,
          courseLevel: d.Course_Level,
          course: d.Course,
          instructor: d.Instructor,
          grade: d.Grade_Given,
          studentCount: +d.Sum_of_Student_Count,
          courseNumber: d.Course_Number,
          department: d.Department
      }
  }).then(function(data){
    var target = findCourse(data,quarter,courseLevel,course,instructor);

    chart = BarChart(target, {
      x: d => d.grade,
      y: d => d.studentCount,
      yLabel: "#Student",
      width: 500,
      height: 300,
      color: "steelblue"
    });

    //append the chart to the body of the html page
    document.getElementById("graphs").appendChild(chart);
  });
}
