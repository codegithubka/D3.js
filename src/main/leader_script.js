// Load the CSV data
d3.csv("Cleaned_Basic_Data.csv").then(data => {
    // Set up the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
          width = 900 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#chart")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up the X axis
    const x = d3.scaleBand()
                .range([0, width])
                .domain(data.map(d => d.Team))
                .padding(0.2);

    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x))
       .selectAll("text")
       .attr("transform", "translate(-10,0)rotate(-45)")
       .style("text-anchor", "end");

    // Set up the Y axis
    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => +d['Number of Members'])])
                .range([height, 0]);

    svg.append("g")
       .call(d3.axisLeft(y));

    // Create a tooltip
    const tooltip = d3.select("body").append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

    // Function to update the chart based on filter
    const updateChart = (filterGender) => {
        const filteredData = filterGender ? data.filter(d => d['Leader Gender'] === filterGender) : data;

        // Update the Y axis domain
        y.domain([0, d3.max(filteredData, d => +d['Number of Members'])]);
        svg.select(".y.axis")
           .transition()
           .duration(1000)
           .call(d3.axisLeft(y));

        // Join the data to the bars
        const bars = svg.selectAll("rect")
                        .data(filteredData);

        // Exit old elements
        bars.exit()
            .transition()
            .duration(1000)
            .attr("y", height)
            .attr("height", 0)
            .remove();

        // Update existing elements
        bars.transition()
            .duration(1000)
            .attr("x", d => x(d.Team))
            .attr("y", d => y(+d['Number of Members']))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(+d['Number of Members']))
            .attr("fill", "#69b3a2");

        // Enter new elements
        bars.enter()
            .append("rect")
            .attr("x", d => x(d.Team))
            .attr("y", height)
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .attr("fill", "#69b3a2")
            .on("mouseover", (event, d) => {
                tooltip.transition()
                       .duration(200)
                       .style("opacity", .9);
                tooltip.html(`Team: ${d.Team}<br>Members: ${d['Number of Members']}<br>Leader: ${d.Leader}`)
                       .style("left", (event.pageX + 5) + "px")
                       .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", d => {
                tooltip.transition()
                       .duration(500)
                       .style("opacity", 0);
            })
            .transition()
            .duration(1000)
            .attr("y", d => y(+d['Number of Members']))
            .attr("height", d => height - y(+d['Number of Members']));
    };

    // Initial chart rendering
    updateChart();

    // Add buttons for filtering by gender
    d3.select("body")
      .append("button")
      .text("Show All")
      .on("click", () => updateChart());

    d3.select("body")
      .append("button")
      .text("Show Male Leaders")
      .on("click", () => updateChart("Male"));

    d3.select("body")
      .append("button")
      .text("Show Female Leaders")
      .on("click", () => updateChart("Female"));
});

