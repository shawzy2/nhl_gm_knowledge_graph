# nhl_gm_knowledge_graph
Creating a knowledge graph to visualize general manager relationships

# Setup Guide
* Clone repo in terminal `git clone https...`
* Install pip `python3 -m pip install --user --upgrade pip`
* Verify installation `python3 -m pip --version`
* Install virtual environment (allows us to download python packages) `python3 -m pip install --user virtualenv`
* Create virtual environment on machine `python3 -m venv env`
* Start virtualenv `source env/bin/activate`
* Install all packages from requirements.txt `pip install -r requirements.txt`

## Running Backend (API & Database)
* export flask environment variables `export FLASK_APP=backend` and `export FLASK_DEBUG=1`
* start flask server from virtualenv `flask run`

## Running Frontend (web application)

