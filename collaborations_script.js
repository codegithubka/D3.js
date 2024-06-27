// Load the CSV data
d3.csv("collaborations.csv").then(data => {
    // Set up dimensions and margins
    const margin = { top: 30, right: 30, bottom: 70, left: 100 },
          width = 960 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#chart")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define the color scale
    const colorScale = d3.scaleOrdinal()
                         .domain(["Strong", "Good", "Trying", "No interest"])
                         .range(["#2ca02c", "#1f77b4", "#ff7f0e", "#d62728"]);

    // Process the data
    const processedData = data.map(d => ({
        team: d.Team,
        collaboration: d["Industrial Collaborations"]
    }));

    // Set up the X axis
    const x = d3.scaleBand()
                .domain(processedData.map(d => d.team))
                .range([0, width])
                .padding(0.1);

    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x))
       .selectAll("text")
       .attr("transform", "translate(-10,0)rotate(-45)")
       .style("text-anchor", "end");

    // Set up the Y axis
    const y = d3.scaleBand()
                .domain(["No interest", "Trying", "Good", "Strong"])
                .range([height, 0])
                .padding(0.1);

    svg.append("g")
       .attr("class", "y-axis")
       .call(d3.axisLeft(y));

    // Create bars
    let bars = svg.selectAll(".bar")
                  .data(processedData)
                  .enter()
                  .append("rect")
                  .attr("class", "bar")
                  .attr("x", d => x(d.team))
                  .attr("y", d => y(d.collaboration))
                  .attr("width", x.bandwidth())
                  .attr("height", y.bandwidth())
                  .attr("fill", d => colorScale(d.collaboration))
                  .on("mouseover", (event, d) => {
                      tooltip.transition()
                             .duration(200)
                             .style("opacity", .9);
                      tooltip.html(`Team: ${d.team}<br>Collaboration: ${d.collaboration}`)
                             .style("left", (event.pageX + 5) + "px")
                             .style("top", (event.pageY - 28) + "px");
                  })
                  .on("mouseout", d => {
                      tooltip.transition()
                             .duration(500)
                             .style("opacity", 0);
                  });

    // Create a tooltip
    const tooltip = d3.select(".tooltip");

    // Filter functionality
    const filterSelect = d3.select("#collaborationFilter");

    filterSelect.on("change", function() {
        const selectedValue = filterSelect.node().value;
        let filteredData = processedData;

        if (selectedValue !== "All") {
            filteredData = processedData.filter(d => d.collaboration === selectedValue);
        }

        // Update bars
        bars = svg.selectAll(".bar")
                  .data(filteredData, d => d.team);

        bars.exit().remove();

        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.team))
            .attr("y", d => y(d.collaboration))
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .attr("fill", d => colorScale(d.collaboration))
            .on("mouseover", (event, d) => {
                tooltip.transition()
                       .duration(200)
                       .style("opacity", .9);
                tooltip.html(`Team: ${d.team}<br>Collaboration: ${d.collaboration}`)
                       .style("left", (event.pageX + 5) + "px")
                       .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", d => {
                tooltip.transition()
                       .duration(500)
                       .style("opacity", 0);
            });
    });
});
