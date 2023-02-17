//###############################################################
// Reading data from a file 
// So far we've seen how to use hardcoded data. Now, we will 
// look at plotting data read in from a file. To read data from 
// another file, you will need to set up a python simple server
// in the same directory as your code and data. To do this:
//  (1) Open your terminal or command line 
//  (2) Navigate to the directory your code is in 
//  (3) Run the command (it will vary slightle depending on how 
//      python is set up for you): python3 -m http.server
//  (4) You will see: 
//        Serving HTTP on :: port 8000 (http://[::]:8000/) ...
//  (5) Naviage to localhost:8000 in the browser to see your
//      webpage
//###############################################################
 
// First, we need a frame  
const FRAME_HEIGHT = 550;
const FRAME_WIDTH = 700; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Let's do another example, with a scale 
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 


//###############################################################
// Adding Interaction  
// To enable interaction, we will still need event handlers
// and listeners. However, we will use d3 syntax instead of js. 
//###############################################################

const FRAME1 = d3.select("#vis1")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

// This time, let's define a function that builds our plot
function build_interactive_plot() {

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

    // // Tooltip

    //  // To add a tooltip, we will need a blank div that we 
    // //  fill in with the appropriate text. Be use to note the
    // //  styling we set here and in the .css
    // const TOOLTIP = d3.select("#vis3")
    //                     .append("div")
    //                       .attr("class", "tooltip")
    //                       .style("opacity", 0); 

    // // Define event handler functions for tooltips
    // function handleMouseover(event, d) {
    //   // on mouseover, make opaque 
    //   TOOLTIP.style("opacity", 1); 
      
    // }

    // function handleMousemove(event, d) {
    //   // position the tooltip and fill in information 
    //   TOOLTIP.html("Name: " + d.name + "<br>Value: " + d.x)
    //           .style("left", (event.pageX + 10) + "px") //add offset
    //                                                       // from mouse
    //           .style("top", (event.pageY - 50) + "px"); 
    // }

    // function handleMouseleave(event, d) {
    //   // on mouseleave, make transparant again 
    //   TOOLTIP.style("opacity", 0); 
    // } 

    // // Add event listeners
    // FRAME3.selectAll(".point")
    //       .on("mouseover", handleMouseover) //add event listeners
    //       .on("mousemove", handleMousemove)
    //       .on("mouseleave", handleMouseleave);    

    // Add an axis to the vis  
    FRAME1.append("g") 
          .attr("transform", "translate(" + MARGINS.left + "," + (VIS_HEIGHT + MARGINS.top) + ")") 
          .call(d3.axisBottom(X1_SCALE).ticks(4)) 
            .attr("font-size", '20px');
    // add an axis
    FRAME1.append("g")       // g is a place holder for an svg
          .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.bottom + ")")
          .call(d3.axisLeft(Y1_SCALE).ticks(4))
            .attr("font-size", "20px");



  });
}

// Call function 
build_interactive_plot();








