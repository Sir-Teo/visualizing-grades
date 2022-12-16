

//loading the data
// Quarter,Course_Level,Course,Instructor,Grade_Given,Sum_of_Student_Count
const grades = d3.csv("/data/grades.csv",function(d){
    return {
        quarter: d.Quarter,
        courseLevel: d.Course_Level,
        course: d.Course,
        instructor: d.Instructor,
        grade: d.Grade_Given,
        studentCount: +d.Sum_of_Student_Count
    }
})
const data = await grades

function findCourse(quarter,courseLevel,course,instructor){
    var course = data.filter(function(d){
        return d.quarter == quarter && d.courseLevel == courseLevel && d.course == course && d.instructor == instructor
    })
    return course
};

var test = findCourse("S22","Undergraduate","ANTH      2","WALSH C");
console.log(test)