# About diploma

## Application example

Follow the link to view the application: https://getstartednode-insightful-puku.eu-gb.mybluemix.net/.
In order to go to the administration page, you must send a request [/login](https://getstartednode-insightful-puku.eu-gb.mybluemix.net/login).

Login: admin 

Password: 123

## Used technologies
  
| front-end     | back-end                                      |
| ------------- |-----------------------------------------------|
| HTML          | [Nodejs](https://nodejs.org)                  |
| CSS           | [Express](https://expressjs.com)              |
| javascript    | [Passportjs](http://www.passportjs.org/)      |
|               | [NeDB](https://github.com/louischatriot/nedb) |
|               | [Handlebars](https://handlebarsjs.com/)       |
 
 The motivation for using NeDB rather than mongodb and handlebars is their lightness and simplicity of the application being developed.
 
 The passportjs was used to authenticate the administrator. The session is saved to the database file and stored for an hour.
 
 ## Administration
 
 **[Main page](https://getstartednode-insightful-puku.eu-gb.mybluemix.net/admin)**. You have the ability to add, delete and edit disciplines.
 
 **[Description of the discipline](https://getstartednode-insightful-puku.eu-gb.mybluemix.net/admin/oQjNkJzq9nzZk3iY?q=description)**. You have the opportunity to edit the description of the discipline. You can embed html in text fields.
 
  **[Lecture material](https://getstartednode-insightful-puku.eu-gb.mybluemix.net/admin/oQjNkJzq9nzZk3iY?q=lectures)** and **[teaching material](https://getstartednode-insightful-puku.eu-gb.mybluemix.net/admin/oQjNkJzq9nzZk3iY?q=teachingMaterial)**.  You have the ability to add and delete files.
  
   **[Videos](https://getstartednode-insightful-puku.eu-gb.mybluemix.net/adminVideo)**. You have the ability to add, delete and edit videos. Videos are added to the page from youtube. It is also possible to sort the video into sections. To add a video to a section, go to the desired section and add a video. When you delete a section, videos from this section will still be available in the general section.
