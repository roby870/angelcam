# angelcam


## How to run the application


### Backend set up

Once you clone the repository, create a virtual environment on the /backend directory. Then activate it, and you have to run (on /backend directory) `pip install -r requirements.txt`. 
Finally, run on /backend/angelcam `python manage.py makemigrations` and after `python manage.py migrate` to set up the database.


### Frontend set up

On the /frontend folder, run `npm install` to install the frontend dependencies. 


### Run commands

With the virtual environment activated, run on backend/angelcam `python manage.py runserver`. This runs the backend server. 
On /frontend, run `npm run start` to run the frontent server.

Note that some URLs are hardcoded, so you need to use the default ports that this commands run (3000 on the frontend server and 8000 on the backend server). Also, keep in mind that these are bash indications.


