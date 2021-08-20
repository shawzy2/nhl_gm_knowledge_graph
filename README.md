# [Proof-of-Concept] Trades Between GMs - Knowledge Graph
Creating a knowledge graph to visualize general manager relationships. Where each node is a single GM and each edge represents a trade between two GMs.

Trade data scraped from http://www.nhltradetracker.com/ on 19Aug2021. This site contains all player transaction trades between GMs (excludes draft pick for draft pick trades i.e. 3rd round pick for 4th and 6th round pick). The site does contain errors in data such as trades being recored twice and data for 2020-21 being incomplete. 

![Proof of Concept](https://user-images.githubusercontent.com/19720687/130279877-6f47e361-c8fd-47b0-ac31-8329e81debf6.png)

# Technology Used
* [Flask](https://flask.palletsprojects.com/en/2.0.x/)/Python - to create endpoints that are consumed by frontend application
* [ReactJS](https://reactjs.org/) - to build frontend application
* [CytoscapeJS](https://github.com/plotly/react-cytoscapejs) - to generate knowledge graph that renders inside frontend application
* [Docker](https://www.docker.com/) - to containerize application for ease of development
* [AWS EC2](https://aws.amazon.com/ec2/?ec2-whats-new.sort-by=item.additionalFields.postDateTime&ec2-whats-new.sort-order=desc) - deploying to public environment to share project

# Quickstart Guide
* Install [Docker](https://docs.docker.com/get-docker/) and [Docker-Compose](https://docs.docker.com/compose/install/)
* Clone repo into workspace `git clone https...`
* From top level of project, run `docker-compose up --build`
* Open project at http://localhost:3000
* To stop docker application, in terminal, type `ctrl`+`c` and allow to complete 'Gracefully stopping'

# Developer's Guide
* Backend API modifications should be in the `backend/` folder
  * To extend data stored, modify `models.py`
  * To add API endpoints, modify `views.py`
* Frontend app modifications take place in the `frontend/nhl-app/` folder
  * This code is a bit unorganized so be prepared to dig for what you need
* When changes are complete, re-build the app from the top level of project by running `docker-compose up --build --force-recreate`

