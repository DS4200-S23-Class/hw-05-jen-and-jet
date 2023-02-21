// Set frame dimensions
const SCATTER_FRAME_HEIGHT = 550;
const SCATTER_FRAME_WIDTH = 700; 

// Create a frame
const FRAME1 = d3.select("#vis1")
                 .append("svg")
                 .attr("height", SCATTER_FRAME_HEIGHT)
                 .attr("width", SCATTER_FRAME_WIDTH)
                 .attr("class", "frame"); 

// Set scatter plot margins
const SCATTER_PLOT_MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Set vis dimensions
const SCATTER_VIS_HEIGHT = SCATTER_FRAME_HEIGHT - SCATTER_PLOT_MARGINS.top - SCATTER_PLOT_MARGINS.bottom;
const SCATTER_VIS_WIDTH = SCATTER_FRAME_WIDTH - SCATTER_PLOT_MARGINS.left - SCATTER_PLOT_MARGINS.right; 


// Build interactive scatter and bar plots
function build_interactive_plots() { 

  // Scatter plot

  // Parse scatter plot data
  d3.csv("data/scatter-data.csv").then((data) => {

    // Find max X value
    const MAX_X1 = d3.max(data, (d) => { return parseInt(d.x); });

    // Find max Y value
    const MAX_Y1 = d3.max(data, (d) => { return parseInt(d.y); });

    // Scale X
    const X1_SCALE = d3.scaleLinear() 
                       .domain([0, (MAX_X1 + 1)]) // add some padding  
                       .range([0, (MAX_Y1 * 50)]); 

    // Scale Y
    const Y1_SCALE = d3.scaleLinear()
                      .domain([0, (MAX_Y1 + 1)])
                      .range([(MAX_Y1 * 50), 0]);

    // Plot points on scatter plot
    FRAME1.selectAll("points")  
          .data(data)  
          .enter()       
          .append("circle")  
            .attr("cx", (d) => { return (X1_SCALE(d.x) + SCATTER_PLOT_MARGINS.left); }) 
            .attr("cy", (d) => { return (Y1_SCALE(d.y) + SCATTER_PLOT_MARGINS.top); }) 
            .attr("r", 10)
            .attr("class", "point")
            .attr("id", (d) => { return '(' + d.x + ', ' + d.y + ')'; });

    // Add X axis  
    FRAME1.append("g") 
          .attr("transform", "translate(" + SCATTER_PLOT_MARGINS.left + "," + (SCATTER_VIS_HEIGHT + SCATTER_PLOT_MARGINS.top) + ")") 
          .call(d3.axisBottom(X1_SCALE).ticks(4)) 
          .attr("font-size", "20px");

    // Add Y axis
    FRAME1.append("g")       
          .attr("transform", "translate(" + SCATTER_PLOT_MARGINS.left + "," + SCATTER_PLOT_MARGINS.bottom + ")")
          .call(d3.axisLeft(Y1_SCALE).ticks(4))
          .attr("font-size", "20px");


    // Event handler for adding a border on a point
    function toggleBorder(event, d) {

      // Add or remove a point's border when clicked on
      if (Object.values(this.classList).includes("border")) {
        this.classList.remove("border");
      } else {
        this.classList.add("border");
      }

      // Show coordinates of last point clicked
      let coordinates = this.getAttribute("id");
      let lastPointClicked = "Last Point Clicked: \n" + coordinates;

      let lastPointClickedDiv = document.getElementById("last-point-clicked");
      lastPointClickedDiv.innerHTML = lastPointClicked;
      
    }


    // Event handler for adding a point
    function addPoint() {

      // Set radius of point
      const RADIUS = 10;

      // Obtain user inputted coordinate values
      let selectXCoord = document.getElementById("selectXCoord");
      let selectYCoord = document.getElementById("selectYCoord");

      // Convert user input into numbers
      let x_coord = Number(selectXCoord.options[selectXCoord.selectedIndex].text);
      let y_coord = Number(selectYCoord.options[selectYCoord.selectedIndex].text);

      // Create and set attributes of new element (point)
     FRAME1.append("circle")  
            .attr("cx", (X1_SCALE(x_coord) + SCATTER_PLOT_MARGINS.left))
            .attr("cy", (Y1_SCALE(y_coord) + SCATTER_PLOT_MARGINS.top)) 
            .attr("r", 10)
            .attr("class", "point")
            .attr("id", "(" + x_coord + ", " + y_coord + ")")
            .on("click", toggleBorder);
      }

    // Get button for adding a point
    document.getElementById("addPoint")
          // Call function (adding a point) when clicked
          .addEventListener("click", addPoint);

    // Add event listeners that add/remove the border to any point clicked on
    FRAME1.selectAll(".point")
      .on("click", toggleBorder);

  }); 

  // Bar chart

  // Set bar graph margins
  const BAR_CHART_MARGINS = {top: 30, right: 30, bottom:30, left: 60};

  // Set frame dimensions
  const BAR_FRAME_WIDTH = 460 - BAR_CHART_MARGINS.left - BAR_CHART_MARGINS.right;
  const BAR_FRAME_HEIGHT = 400 - BAR_CHART_MARGINS.top - BAR_CHART_MARGINS.bottom;

  // Append the bar graph frame to the body of the page
  const FRAME2 = d3.select("#vis2")
                    .append("svg")
                    .attr("width", BAR_FRAME_WIDTH + BAR_CHART_MARGINS.left + BAR_CHART_MARGINS.right)
                    .attr("height", BAR_FRAME_HEIGHT + BAR_CHART_MARGINS.top + BAR_CHART_MARGINS.bottom)
                    .append("g")
                    .attr("transform", "translate(" + BAR_CHART_MARGINS.left + "," + BAR_CHART_MARGINS.top + ")");

  // Parse bar graph data
  d3.csv("data/bar-data.csv").then((data) => {

    // Scale X axis
    const BAR_X_SCALE = d3.scaleBand()
                          .range([ 0, BAR_FRAME_WIDTH ])
                          .domain(data.map(function(d) { return d.category; }))
                          .padding(0.2);

    // Add X axis
    FRAME2.append("g")
          .attr("transform", "translate(0," + BAR_FRAME_HEIGHT + ")")
          .call(d3.axisBottom(BAR_X_SCALE))
          .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");

    // Find max Y value
    const MAX_VAL = d3.max(data, (d) => { return parseInt(d.amount); });

    // Scale Y axis
    const BAR_Y_SCALE = d3.scaleLinear()
                          .domain([0, MAX_VAL])
                          .range([ BAR_FRAME_HEIGHT, 0]);

    // Add Y axis
    FRAME2.append("g")
          .call(d3.axisLeft(BAR_Y_SCALE));

    // Create bars, which are scaled accordingly
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

    // Create tooltip
    const TOOLTIP = d3.select("#vis2")
                      .append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0); 

    // Event handler
    function handleMouseover(event, d) {
      // on mouseover, make opaque 
        TOOLTIP.style("opacity", 1); 
    }

    // Event handler
    function handleMousemove(event, d) {
     // position the tooltip and fill in information 
     TOOLTIP.html("Category: " + d.category + "<br>Amount: " + d.amount)
             .style("left", (event.pageX + 10) + "px") //add offset
                                                         // from mouse
             .style("top", (event.pageY - 50) + "px"); 
    }

    // Event handler
    function handleMouseleave(event, d) {
      // on mouseleave, make the tooltip transparent again 
      TOOLTIP.style("opacity", 0); 
    } 

    // Add tooltip event listeners
    FRAME2.selectAll(".bar")
          .on("mouseover", handleMouseover)
          .on("mousemove", handleMousemove)
          .on("mouseleave", handleMouseleave); 
  });
}

// Call function to display the plots
build_interactive_plots();
