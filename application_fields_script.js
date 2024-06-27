// script.js

document.addEventListener('DOMContentLoaded', function() {
    const data = {
        "name": "Teams",
        "children": [
            {
                "name": "DICE",
                "children": [
                    {"name": "M&A"},
                    {"name": "Financial Classification"},
                    {"name": "Customer Comms"},
                    {"name": "Decision Support"},
                    {"name": "Predictive Modeling"},
                    {"name": "Knowledge Extraction"}
                ]
            },
            {
                "name": "MagCIL",
                "children": [
                    {"name": "Music Information Retrieval"},
                    {"name": "Automatic SR"},
                    {"name": "Audio Classification"},
                    {"name": "API"}
                ]
            },
            {
                "name": "BioHIT",
                "children": [
                    {"name": "Open Data Analysis Platform"},
                    {"name": "Open Data Graph"},
                    {"name": "Web Browser"},
                    {"name": "KG Link Predictor"},
                    {"name": "BioASQ Infrastructure"},
                    {"name": "In-silico DMD Platform"}
                ]
            },
            {
                "name": "CAKT",
                "children": []
            },
            {
                "name": "CER",
                "children": [
                    {"name": "Maritime Situational Awareness"},
                    {"name": "Public Space Surveillance"},
                    {"name": "Vehicle Fleet Management"},
                    {"name": "Credit Card Fraud"},
                    {"name": "E-Commerce and Voting Procedures"}
                ]
            }
        ]
    };

    const width = 960;
    const height = 600;

    const svg = d3.select("#tree-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(40,0)");

    const treeLayout = d3.tree().size([height, width - 160]);

    const root = d3.hierarchy(data);

    treeLayout(root);

    svg.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x)
        );

    const node = svg.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.y},${d.x})`);

    node.append('circle')
        .attr('r', 5);

    node.append('text')
        .attr('dy', 3)
        .attr('x', d => d.children ? -8 : 8)
        .style('text-anchor', d => d.children ? 'end' : 'start')
        .text(d => d.data.name);
});
