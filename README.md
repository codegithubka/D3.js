# Research Teams Visualization

This repository contains a collection of visualizations for research teams, including team leaders, team connections, and industrial collaborations. The visualizations are created using D3.js and are designed to provide insights into various aspects of research team dynamics.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Usage](#usage)
- [Files](#files)
- [Visualizations](#visualizations)
- [Contributing](#contributing)
- [License](#license)

## Overview

The project includes the following visualizations:
- **Leader Teams Visualization**: Shows the number of members in each research team led by different leaders.
- **Team Connections Network**: Displays the network of connections between teams and sectors based on their collaborations.
- **Industrial Collaborations Visualization**: Illustrates the level of industrial collaboration for each team.

## Setup

### Prerequisites

- A web server to host the HTML files (e.g., [http-server](https://www.npmjs.com/package/http-server) for local development).
- Modern web browser (Chrome, Firefox, Edge, Safari).

### Installation

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/codegithubka/research-teams-visualization.git
    cd research-teams-visualization
    ```

2. Ensure you have a web server installed. If not, you can install `http-server` using npm:

    ```bash
    npm install -g http-server
    ```

3. Start the web server in the project directory:

    ```bash
    http-server
    ```

4. Open your browser and navigate to the address provided by the web server (e.g., `http://localhost:8080`).

## Usage

To view the visualizations, simply open the `combined_visualization.html` file in your web browser. This file integrates all the visualizations into a single page with a dark theme and enhanced colors for better visual appeal.

## Files

- `combined_visualization.html`: The main HTML file that combines all visualizations.
- `Cleaned_Basic_Data.csv`: CSV file containing data for the Leader Teams Visualization.
- `Team Connections - Sheet1.csv`: CSV file containing data for the Team Connections Network.
- `collaborations.csv`: CSV file containing data for the Industrial Collaborations Visualization.
- `leader_script.js`: JavaScript file for the Leader Teams Visualization.
- `team_connections_script.js`: JavaScript file for the Team Connections Network.
- `collaborations_script.js`: JavaScript file for the Industrial Collaborations Visualization.

## Visualizations

### Leader Teams Visualization

- Shows the number of members in each research team.
- Filter options to display all leaders, male leaders, or female leaders.

### Team Connections Network

- Displays a network graph of team connections.
- Nodes represent teams and sectors, while links represent connections between them.

### Industrial Collaborations Visualization

- Bar chart illustrating the level of industrial collaboration for each team.
- Filter option to select different levels of collaboration.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
