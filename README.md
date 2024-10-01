# angelcam


## How to run the application


### Backend set up

Once you have cloned the repository, create a virtual environment on the /backend directory running `python3.12 -m venv venv`. Then activate it with `source ./venv/bin/activate`, and you have to run (on /backend directory) `pip install -r requirements.txt`. 
Finally, run on /backend/angelcam `python manage.py migrate` to set up the database.


### Frontend set up

On the /frontend folder, run `npm install` to install the frontend dependencies. 


### Run commands

With the virtual environment activated, run on backend/angelcam `python manage.py runserver`. This runs the backend server. 
On /frontend, run `npm run start` to run the frontent server.

Note that some URLs are hardcoded, so you need to use the default local servers that these commands run (http://localhost:3000/ on the frontend server and http://127.0.0.1:8000/ on the backend server). Also, keep in mind that all of these are bash indications.


### Login credentials

You can send me a message on LinkedIn so I can share an email and a token with you, allowing you to log in and view two test cameras.


