# Equation Relay


### Deployment

[Live App: https://www.equationrelay.com/](https://www.equationrelay.com/)

[Front-End Repo](https://github.com/MorganHuegel/equation-relay-client)


### Summary

#### *Make Math collaborative!*

Teachers and students alike are tired of boring old worksheets.  Equation Relay is the solution to this problem!  
Equation Relay is a web app used for practicing Math skills in a classroom setting.  Teachers create games based 
on their current curriculum (*browsing premade Public games is a feature coming soon*).  Then, to play the game, 
the teacher displays a Join Code to their students.  Using the simple interface, the classroom of students is 
randomly split into teams of 3-4, and the teams solve math problems to earn points.  Each individual team member is 
given a different problem to solve, and team-members must add all 4 of their answers together in order to be correct.  
If they are wrong, they must collaborate to figure out which group member is incorrect.  Live results are scoreboarded 
on the teacher's screen for quick monitoring and fun competition.

### Tech-Stack

* Front-end
    * React
    * Web Sockets (socket.io)
    * react-router-dom, react-spinkit, react-sparkles
    * CSS Transitions
    * Mobile-First, Responsive Design

* Back-end
    * Node/Express
    * Wolfram Alpha Microservice (Axios)
    * GraphQL
    * Web Sockets (socket.io)
    * MongoDB
    * password encryption (BCrypt.js)
    * JSON Web Tokens
    
