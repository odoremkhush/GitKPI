# GitLab Merge Request KPI Tracker

This project utilizes the GitLab APIs to fetch merge requests and calculate user efficiency based on their merge request activity. It provides a Key Performance Indicator (KPI) dashboard to measure and visualize team members' contributions and performance.

## Features

- Fetch merge requests from GitLab repositories.
- Analyze user activity and calculate efficiency metrics based on merge request data.
- Generate KPIs for individual team members, including:
  - Number of merge requests created, reviewed, and merged.
  - Average time to merge.
  - Lines of code added/removed.
- Customizable metrics to suit team requirements.

## Prerequisites

- A GitLab account and access token with permissions to read merge requests.
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
- A backend server (e.g., Python, Node.js, or your preferred language) for API interaction and data processing.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/gitlab-kpi-tracker.git
   cd gitlab-kpi-tracker
