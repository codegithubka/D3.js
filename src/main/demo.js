document.addEventListener('DOMContentLoaded', function () {
    const width = 960;
    const height = 600;

    const svg = d3.select('svg')
        .attr('width', width)
        .attr('height', height)
        .call(d3.zoom().on('zoom', function (event) {
            svg.attr('transform', event.transform);
        }))
        .append('g');

    const simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2));

    d3.csv('Globally_Unique_Demo_Sheet.csv').then(data => {
        const nodes = [];
        const links = [];

        const teams = Array.from(new Set(data.map(d => d.Team)));
        const teamNodes = teams.map(team => ({ id: team, type: 'team' }));
        nodes.push(...teamNodes);

        data.forEach(row => {
            const team = row.Team;
            const demoCols = Object.keys(row).filter(key => key.includes('Demo'));
            const trlCols = demoCols.map(col => col.replace('Demo', 'TRL'));

            demoCols.forEach((demoCol, index) => {
                const demo = row[demoCol];
                const trl = row[trlCols[index]];
                nodes.push({ id: demo, type: 'demo' });
                nodes.push({ id: `${demo}_trl`, type: 'trl', trl: trl });
                links.push({ source: team, target: demo });
                links.push({ source: demo, target: `${demo}_trl` });
            });
        });

        const link = svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(links)
            .enter().append('line')
            .attr('class', 'link');

        const node = svg.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(nodes)
            .enter().append('circle')
            .attr('class', 'node')
            .attr('r', d => d.type === 'team' ? 10 : (d.type === 'demo' ? 5 : 3))
            .attr('fill', d => d.type === 'team' ? '#ff0000' : (d.type === 'demo' ? '#00ff00' : '#0000ff'))
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        const text = svg.append('g')
            .attr('class', 'texts')
            .selectAll('text')
            .data(nodes)
            .enter().append('text')
            .text(d => d.type === 'trl' ? `TRL: ${d.trl}` : d.id)
            .attr('x', 6)
            .attr('y', 3);

        simulation
            .nodes(nodes)
            .on('tick', ticked);

        simulation.force('link')
            .links(links);

        function ticked() {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            text
                .attr('x', d => d.x + 6)
                .attr('y', d => d.y + 3);
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
});
