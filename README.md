# Surfing-paradise-backend :closed_lock_with_key:

### This project is part from my full-stack diploma
<br><br>

# :lock: In this secure backend server i used: :lock:
### Clear server error message from end users in production, Improper Error Handling
### crypto (nodeJs) user password in the database using HASH\SALT.
### prevent unauthorized entering to different sections of the site.
### admin\user login.
<br>

## how to run the project 
-- clone the repository.
# Backend
## To run DB on mac with mySQL
### install mysql using the following commands: 
1. brew install mysql
2. brew tap homebrew/services
3. brew services start mysql
4. mysqladmin -u root password '<your password>’'
5. In ./backend/config-dev.json change to your password
6. Install Mysql workbench https://dev.mysql.com/downloads/workbench/
### In workbench:
1. Create a new connection on workbench
2. Inside the new connection open file user_managment.sql
3. Run the sql command ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password  BY '< your password>'
4. Run the file script (using the lightning icon)

### assuming you have SQL server management software, node  installed.
1. cd to backend folder.
2. run `npm install`
3. run `node app` to run the server



| NPM package name        | Usage           | 
| ------------- |:-------------:| 
| cors     | Handle loading of resources from my website | 
| express     | Manage and develop the server      |  
| mysql | Create data base      |  
| uuid | Create unique Ids, prevent IDOR - Insecure Direct Object Reference  |  
| strip-tags | Prevent tags injection into SQL      |  
| svg-captcha | Prevent login DosS attack       |  
| express-rate-limit | Prevent server response DosS attack     |  
| jsonwebtoken | Enable token based secure login authorization       |  
| cookie-parser | Enable sending an receiving cookies from the front      |  
| joi | Data input validation      |  
| socket.io | Enable listener for connected Clients to the server        |  


<!-- TODO -->
Add captcha
Update socket on Followed vacations
