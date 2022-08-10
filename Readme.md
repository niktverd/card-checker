To run this project on heroku 

heroku buildpacks:add jontewks/puppeteer
heroku ps:scale web=1
heroku buildpacks:set heroku/nodejs


https://docs.google.com/spreadsheets/d/1iipbkUYBWRGe4qh-TeUZXgnF7iMZmO_aIzlBExBWnsY/edit#gid=2129219837

heroku buildpacks:add jontewks/puppeteer && git push heroku master