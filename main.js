// Create frame  
const FRAME_HEIGHT = 550;
const FRAME_WIDTH = 700; 

// Set margins
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Set vis dimensions
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 


const FRAME1 = d3.select("#vis1")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 


// Build interactive scatter plot
function build_interactive_scatter_plot() {

  d3.csv("data/scatter-data.csv").then((data) => {

    // Build plot inside of .then 
    // find max X
    const MAX_X1 = d3.max(data, (d) => { return parseInt(d.x); });


    // scaling functions
    const MAX_Y1 = d3.max(data, (d) => {return parseInt(d.y); });

    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const X1_SCALE = d3.scaleLinear() 
                      .domain([0, (MAX_X1 + 1)]) // add some padding  
                      .range([0, (MAX_Y1 * 50)]); 

    // scale function
    const Y1_SCALE = d3.scaleLinear()
                      .domain([0, (MAX_Y1 + 1)])
                      .range([(MAX_Y1 * 50), 0]);

    // Use X_SCALE to plot our points
    FRAME1.selectAll("points")  
        .data(data) // passed from .then  
        .enter()       
        .append("circle")  
          .attr("cx", (d) => { return (X1_SCALE(d.x) + MARGINS.left); }) 
          .attr("cy", (d) => { return (Y1_SCALE(d.y) + MARGINS.top); }) 
          .attr("r", 10)
          .attr("class", "point");


    // Add event listeners
    FRAME1.selectAll(".point")
          .on("mouseover", function() {
                            d3.select(".point").attr("stroke", "pink")
                                        .attr("stroke-width", "5px");}) //add event listeners
          .on("mouseleave", function() {
                              d3.select(".point").attr("stroke", "black")
                                          .attr("stroke-width", "5px");});    

    // Add x axis to the vis  
    FRAME1.append("g") 
          .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
          .call(d3.axisBottom(X1_SCALE).ticks(4)) 
            .attr("font-size", '20px');

    // Add y axis
    FRAME1.append("g")       // g is a place holder for an svg
          .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
          .call(d3.axisLeft(Y1_SCALE).ticks(4))
            .attr("font-size", "20px");



  });
}

// Call function 
build_interactive_scatter_plot();








