# Getting started
`npm start`

# Dependencies
Please read over package.json file

# Data
Data is in json format in data.json, I generated it for test purposes. Please review properties. In data.ts, i am getting aggregate values for state and county levels. 

# Circle coordinates on map
There is getProjection() function in utils.js which you can use to calculate x and y for each zip code. You can use this function in backend when you generate data for frontend. 
Make sure all zip code have "x" and "y" properties, so they will be shown on map in right place.
