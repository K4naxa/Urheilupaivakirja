Start with nodemon: npm run start

#Tietokantahaut

/login/

> POST

/register/

> POST

/user/unverified

> GET

/user/verify

> PUT

/journal/

> GET
> /journal/:user_id (yksittäinen journal)
> GET

/journal_entry/

> POST
> /journal_entry/:id
> GET
> PUT
> DELETE
> /journal_entry/options
> GET

/student_group/

> GET
> POST
> /student_group/:id
> PUT
> DELETE

/campus/

> GET
> POST
> /campus/:id
> PUT
> DELETE

/sport/

> GET
> POST
> /sport/:id
> PUT
> DELETE

/news/

> GET
> POST
> /news/:id
> PUT
> DELETE

/journal_entry_type/

> GET
> POST
> /journal_entry_type/:id
> PUT
> DELETE

/workout_type/

> GET
> POST
> /workout_type/
> PUT
> DELETE

/workout_categories/

> GET
> POST
> /workout_categories/
> PUT
> DELETE

/user/:id

> PUT (CHANGE PASSWORD)
> DELETE

/student/

> GET
> /student/:id
> GET
> PUT

/teacher/:id

> GET
> PUT

/spectator/

> GET
> /spectator/:id
> GET
> PUT

/public/options
>GET