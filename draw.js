function main() {
	// read grades.csv file using d3
    d3.csv("grades.csv", function(data) {
        for (var i = 0; i < 10; i++) {
            console.log(data[i].Quarter);
            console.log(data[i].Course);
        }
    });
}
main();