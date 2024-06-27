// Load the CSV data
d3.csv("Cleaned_Basic_Data.csv").then(data => {
    // Prepare the data for bubble chart
    const focusData = data.map(d => {
        return d.Focus.split(',').map(focus => ({
            team: d.Team,
            focus: focus.trim()
        }));
    }).flat();

    // Set up dimensions and margins
    const margin = { top: 30, right: 30, bottom: 30, left: 30 },
          width = 960 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#chart")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up a color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Set up a scale for bubble size
    const size = d3.scaleSqrt()
                   .domain([1, d3.max(focusData, d => d.focus.length)])
                   .range([10, 50]);

    // Set up the tooltip
    const tooltip = d3.select(".tooltip");

    // Create a simulation
    const simulation = d3.forceSimulation(focusData)
                         .force("center", d3.forceCenter(width / 2, height / 2))
                         .force("charge", d3.forceManyBody().strength(5))
                         .force("collide", d3.forceCollide().radius(d => size(d.focus.length) + 10).strength(0.9));

    // Create nodes
    const node = svg.selectAll("circle")
                    .data(focusData)
                    .enter()
                    .append("g")
                    .attr("class", "node")
                    .call(d3.drag()
                        .on("start", dragStarted)
                        .on("drag", dragged)
                        .on("end", dragEnded));

    node.append("circle")
        .attr("class", "bubble")
        .attr("r", d => size(d.focus.length))
        .attr("fill", d => color(d.team))
        .on("mouseover", (event, d) => {
            tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
            tooltip.html(`Team: ${d.team}<br>Focus: ${d.focus}`)
                   .style("left", (event.pageX + 5) + "px")
                   .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", d => {
            tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
        });

    node.append("text")
        .attr("dy", ".3em")
        .text(d => d.team);

    simulation.on("tick", () => {
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragStarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragEnded(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
});

    