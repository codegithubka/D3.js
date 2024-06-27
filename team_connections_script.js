// Load the data
d3.csv("Team Connections - Sheet1.csv").then(data => {
    // Prepare the data
    const nodesMap = new Map();
    const links = [];
    
    data.forEach(row => {
        const team = row['Team'];
        if (!nodesMap.has(team)) {
            nodesMap.set(team, { id: team, type: 'team' });
        }

        Object.keys(row).forEach(key => {
            if (row[key] === 'Yes') {
                if (!nodesMap.has(key)) {
                    nodesMap.set(key, { id: key, type: 'sector' });
                }
                links.push({ source: team, target: key });
            }
        });
    });

    // Convert nodes map to array
    const nodesArray = Array.from(nodesMap.values());

    // Create the graph
    const width = 800;
    const height = 600;

    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("display", "none");

    const simulation = d3.forceSimulation(nodesArray)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("class", "link");

    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodesArray)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 8)
        .style("fill", d => d.type === 'team' ? 'blue' : 'green')
        .on("mouseover", function(event, d) {
            tooltip.style("display", "block")
                   .html(`ID: ${d.id}<br>Type: ${d.type}`);
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY + 10) + "px")
                   .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("display", "none");
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    const label = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(nodesArray)
        .enter().append("text")
        .attr("class", "label")
        .attr("dy", -10)
        .text(d => d.id);

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    }

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
});
