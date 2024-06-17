# admin site
[here](https://admin.ogwen.eu.org)
## TODO
 - [ ] add features to each service
 - [ ] allow for disabling a user per service not just in general
    - [x] each verify token request needs to report the service it it coming from
    - [x] when making a verify token request check they have the correct permissions
    - [x] when logging in make sure they have the correct permissions
    - [ ] route for disabling a user on specific services
    - [ ] frontend for disabling a user on specific services
 - [ ] analytics
   - [x] login data route
   - [x] display login data graph
   - [x] display each type of failed login for each day in a table
   - [x] fix graph scale
   - [ ] allow for changing timescale
   - [x] make analytics for number of tables created
   - [ ] make analytics for number of accounts registered