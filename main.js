// Create a frame for the scatterplot
const SCATTER_FRAME_HEIGHT = 550;
const SCATTER_FRAME_WIDTH = 700; 

// Set scatter plot margins
const SCATTER_PLOT_MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Set vis dimensions
const SCATTER_VIS_HEIGHT = SCATTER_FRAME_HEIGHT - SCATTER_PLOT_MARGINS.top - SCATTER_PLOT_MARGINS.bottom;
const SCATTER_VIS_WIDTH = SCATTER_FRAME_WIDTH - SCATTER_PLOT_MARGINS.left - SCATTER_PLOT_MARGINS.right; 


const FRAME1 = d3.select("#vis1")
                  .append("svg")
                    .attr("height", SCATTER_FRAME_HEIGHT)
                    .attr("width", SCATTER_FRAME_WIDTH)
                    .attr("class", "frame"); 


// Build interactive scatter and bar plots
function build_interactive_plots() { 

  // Scatter plot

  d3.csv("data/scatter-data.csv").then((data) => {;

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

    // Plot the points on the scatter plot
    FRAME1.selectAll("points")  
        .data(data) // passed from .then  
        .enter()       
        .append("circle")  
          .attr("cx", (d) => { return (X1_SCALE(d.x) + SCATTER_PLOT_MARGINS.left); }) 
          .attr("cy", (d) => { return (Y1_SCALE(d.y) + SCATTER_PLOT_MARGINS.top); }) 
          .attr("r", 10)
          .attr("class", "point");

    // Add x axis to the vis  
    FRAME1.append("g") 
          .attr("transform", "translate(" + SCATTER_PLOT_MARGINS.left + "," + (SCATTER_VIS_HEIGHT + SCATTER_PLOT_MARGINS.top) + ")") 
          .call(d3.axisBottom(X1_SCALE).ticks(4)) 
            .attr("font-size", '20px');

    // Add y axis
    FRAME1.append("g")       // g is a place holder for an svg
          .attr("transform", "translate(" + SCATTER_PLOT_MARGINS.left + "," + SCATTER_PLOT_MARGINS.bottom + ")")
          .call(d3.axisLeft(Y1_SCALE).ticks(4))
            .attr("font-size", "20px");

    function toggleBorder1(event, d) {

      // add or remove a border to a point if clicked on
      if (Object.values(this.classList).includes('border')) {
        this.classList.remove('border')
      } else {
        this.classList.add('border')

      // show the coordinates of the last point clicked in the right column
      let lastPointClicked = "Last Point Clicked: \n" + '(' + d.x + ', ' + d.y + ')';
      console.log('hey', this)

      let lastPointClickedDiv = document.getElementById("last-point-clicked");
      lastPointClickedDiv.innerHTML = lastPointClicked;
      }
    }

    function toggleBorder2(event, d) {
    
      console.log('hola', this.classList)
      // add or remove a border to a point if clicked on
      if (Object.values(this.classList).includes('border')) {
        this.classList.remove('border');
      } else {
        this.classList.add('border');
      }

      // show the coordinates of the last point clicked in the right column
      let lastPointClicked = "Last Point Clicked: \n" + this.id;

      let lastPointClickedDiv = document.getElementById("last-point-clicked");
      lastPointClickedDiv.innerHTML = lastPointClicked;
  }


    // Event handler for adding a point
    function addPoint() {

      // set radius as a constant
      const RADIUS = 10;

      // obtain the coordinate values the user inputted
      let selectXCoord = document.getElementById('selectXCoord');
      let selectYCoord = document.getElementById('selectYCoord');

      // convert user input into numbers
      let x_coord = Number(selectXCoord.options[selectXCoord.selectedIndex].text);
      let y_coord = Number(selectYCoord.options[selectYCoord.selectedIndex].text);

      // create and set the attributes of the new element (point)
       FRAME1.append("circle")  
              .attr("cx", (X1_SCALE(x_coord) + SCATTER_PLOT_MARGINS.left))
              .attr("cy", (Y1_SCALE(y_coord) + SCATTER_PLOT_MARGINS.top)) 
              .attr("r", 10)
              .attr("class", "point")
              .attr("id", '(' + x_coord + ', ' + y_coord + ')')
    }

    // get the button for adding a point
    document.getElementById('addPoint')
          // call the function (adding a point) when clicked
          .addEventListener('click', addPoint);

    // Add the event listeners that adds/removes a border to any point that gets clicked on
    d3.selectAll(".point")
      .on('click', toggleBorder1);

    // Add the event listeners that adds/removes a border to any point that gets clicked on
    FRAME1.selectAll(".new-point")
      .on('click', toggleBorder2);

  }); 

    // Bar chart

    // set the dimensions and SCATTER_PLOT_MARGINS of the graph
    const BAR_CHART_MARGINS = {top: 30, right: 30, bottom:30, left: 60};
    const BAR_FRAME_WIDTH = 460 - BAR_CHART_MARGINS.left - BAR_CHART_MARGINS.right;
    const BAR_FRAME_HEIGHT = 400 - BAR_CHART_MARGINS.top - BAR_CHART_MARGINS.bottom;

    // append the svg object to the body of the page
    const FRAME2 = d3.select("#vis2")
      .append("svg")
        .attr("width", BAR_FRAME_WIDTH + BAR_CHART_MARGINS.left + BAR_CHART_MARGINS.right)
        .attr("height", BAR_FRAME_HEIGHT + BAR_CHART_MARGINS.top + BAR_CHART_MARGINS.bottom)
      .append("g")
        .attr("transform",
              "translate(" + BAR_CHART_MARGINS.left + "," + BAR_CHART_MARGINS.top + ")");

    // Parse the Data
    d3.csv("data/bar-data.csv").then((data) => {;

    // X axis
    const BAR_X_SCALE = d3.scaleBand()
      .range([ 0, BAR_FRAME_WIDTH ])
      .domain(data.map(function(d) { return d.category; }))
      .padding(0.2);
    FRAME2.append("g")
      .attr("transform", "translate(0," + BAR_FRAME_HEIGHT + ")")
      .call(d3.axisBottom(BAR_X_SCALE))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis

    // find max value
    const MAX_VAL = d3.max(data, (d) => { return parseInt(d.amount); });

    const BAR_Y_SCALE = d3.scaleLinear()
      .domain([0, MAX_VAL])
      .range([ BAR_FRAME_HEIGHT, 0]);
    FRAME2.append("g")
      .call(d3.axisLeft(BAR_Y_SCALE));

    // Bars
    FRAME2.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
        .attr("x", function(d) { return BAR_X_SCALE(d.category); })
        .attr("y", function(d) { return BAR_Y_SCALE(d.amount); })
        .attr("width", BAR_X_SCALE.bandwidth())
        .attr("height", function(d) { return BAR_FRAME_HEIGHT - BAR_Y_SCALE(d.amount); })
        .attr("class", "bar");

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
      // on mouseleave, make transparent again 
      TOOLTIP.style("opacity", 0); 
    } 

    // Add event listeners
    FRAME2.selectAll(".bar")
          .on("mouseover", handleMouseover) //add event listeners
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave); 
  });
}

// Call function 
build_interactive_plots();
