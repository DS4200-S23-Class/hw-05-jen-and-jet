// Create a frame for the scatterplot
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

// Create a frame for the bar chart
const FRAME2 = d3.select("#vis2")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 


// Build interactive scatter and bar plots
function build_interactive_plots() {

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

    // Event handler for clicking a point
    const BORDER = d3.select("#vis1")
                        .append("div")
                          .attr("class", "circle")
                          .style("opacity", 0); 

    function toggleBorder(event, d) {

      // add or remove a border to a point if clicked on
      console.log(d.x)
      console.log(d)
      console.log(point.cx)
      console.log(Object.values(event.classList))
      if (Object.values(event.classList).includes('border')) {
        event.classList.remove(border)
        BORDER.style("opacity", 0); 
      } else {
        event.classList.add(border)
        BORDER.style("left", (event.pageX + 10) + "px") //add offset
              .style("top", (event.pageY - 50) + "px"); 
      }}

    // Add event listeners
    FRAME1.selectAll(".point")
      .on('click', toggleBorder)



  });
}

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom:30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#vis2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("data/bar-data.csv").then((data) => {;

// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.category; }))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Add Y 

// find max value
const MAX_VAL = d3.max(data, (d) => { return parseInt(d.amount); });

var y = d3.scaleLinear()
  .domain([0, MAX_VAL])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Bars
svg.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.category); })
    .attr("y", function(d) { return y(d.amount); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.amount); })
    .attr("class", "bar");

});

// Tooltip

    // To add a tooltip, we will need a blank div that we fill in with the appropriate text 
    const TOOLTIP = d3.select("#vis2")
                        .append("div")
                          .attr("class", "tooltip")
                          .style("opacity", 0); 

    // Define event handler functions for tooltips
    function handleMouseover(event, d) {
      // on mouseover, make opaque 
      TOOLTIP.style("opacity", 1); 
      
    }

    function handleMousemove(event, d) {
      // position the tooltip and fill in information 
      TOOLTIP.html("Category: " + d.category + "<br>Amount: " + d.amount)
              .style("left", (event.pageX + 10) + "px") //add offset
                                                          // from mouse
              .style("top", (event.pageY - 50) + "px"); 
    }

    function handleMouseleave(event, d) {
      // on mouseleave, make transparant again 
      TOOLTIP.style("opacity", 0); 
    } 

    // Add event listeners
    FRAME2.selectAll(".bar")
          .on("mouseover", handleMouseover) //add event listeners
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave); 

// Call function 
build_interactive_plots();








