# Quantum Delivery Web Application

This project is a web application that represents the front end of a Quantum Delivery Routing system.

# Contents
- Components: Includes all of the components or 'pages' in our web app

    > Log In / Register - component for user validation.

    > Account Management - component for user management.

    > DailyReports.jsx - component for data reports.

    > UploadRunsheet.jsx - component for uploading orders.

    > ViewRoutes.jsx - component for visualizing routes.

    > Home.jsx - component for homepage/landing page.

- Constants: contains the app's constant routes and router setup

    > routes.js - file to initialize the routes to each component.

    
Testing pushing direct to main X2

# How to add a new web page
- Create .jsx file in the ‘pages’ folder
- Create required components in the ‘components’ folder
- Add route to both route.js and routes.js in the ‘constants’ folder
- Update NavBar.jsx in the components folder (if required)
- Check for necessary import statements


# Developing process for database usage limitations  
- Run a local version of the C# with OFFLINE_DATA set as a conditional compilation field in RoutingData.csproj file
- Ensure endpoint in Constants.js is set to localhost. (Confirm Port number same)
- When done with all changes, switch Constants.js to live database
- DO NOT LEAVE PAGE OPEN WHEN MAKING CHANGES ON THE CONNECTION
- Once all changes ready, confirm Constants.js is set to live database endpoint and merge. 
