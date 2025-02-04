# 🏋️ Workout & Course Progress Tracker

A comprehensive web application designed to help students and teachers track workout activities

and academic progress. Students can log their workouts, monitor their training intensity, and

track their progress toward course goals. Teachers can oversee student activity, analyze training

data, and provide feedback to ensure students meet their physical education objectives. The

application fosters a collaborative environment between students and educators, promoting

accountability and motivation.

## 🎯 Key Features

### For Students

- Workout logging with details such as duration, intensity, and type

- Progress tracking and visualization

- Course goal progress monitoring

### For Teachers

- Dashboard for monitoring student activity (Week / Month / Year views)

- Modify students' course requirements

- Provide feedback and track student progress

- Overview of all student activities in one place

## 🚀 Technical Stack

- **Frontend**: React & TailwindCSS

- **Backend**: Node.js & Express

- **Database**: MySQL

- **Containerization**: Docker

## 🔖 Screenshots




#### Login page
![Loginpage light theme](https://github.com/tredu/urheilupaivakirja-2-0-urheilupaivakirja2024/blob/main/screenshots/login.png)

#### Login page (dark theme)
![Loginpage light theme](https://github.com/tredu/urheilupaivakirja-2-0-urheilupaivakirja2024/blob/main/screenshots/login-dark.png)

#### Student home
![Loginpage light theme](https://github.com/tredu/urheilupaivakirja-2-0-urheilupaivakirja2024/blob/main/screenshots/studenthome.png)

#### Student home (dark theme)
![Loginpage light theme](https://github.com/tredu/urheilupaivakirja-2-0-urheilupaivakirja2024/blob/main/screenshots/studenthome-dark.png)

#### Teacher home
![Loginpage light theme](https://github.com/tredu/urheilupaivakirja-2-0-urheilupaivakirja2024/blob/main/screenshots/teacherhome.png)

#### Teacher home (dark theme)
![Loginpage light theme](https://github.com/tredu/urheilupaivakirja-2-0-urheilupaivakirja2024/blob/main/screenshots/teacherhome-dark.png)

#### Teachers view of students page
![Loginpage light theme](https://github.com/tredu/urheilupaivakirja-2-0-urheilupaivakirja2024/blob/main/screenshots/studentpage.png)

#### Teachers view of students page (dark theme)
![Loginpage light theme](https://github.com/tredu/urheilupaivakirja-2-0-urheilupaivakirja2024/blob/main/screenshots/studentpage-dark.png)




## 📥 Setup Guide

### Production Deployment


1. Clone Release branch  
2. Build Docker image
```bash
docker build -t urheilupaivakirja -f dockerfile-clean-install .
```
3. Update docker-compose.yml with your database and email service information
4. Start the application
```bash
docker compose up -d
```
5. Login with the default teacher account, invite yourself as new teacher from `Hallinta` > `Henkilökunta` >  `Opettaja`
6. Register your account and delete the default teacher account. 

The app will have 1 default teacher account:

- Email: `teacher@example.com`

- Password: `OpettajanOletusSalasana`

You can update the account details in the profile page.

---

### Demo Deployment

1. Clone the DEMO branch
2. Build Docker image for the demo
```bash
docker  build  -t  urheilupaivakirja-demo  -f  dockerfile-DEMO-install  .
```
3. Update docker-compose.yml with correct information
4. Start the application
```bash
docker  compose  up  -d
```

The demo version includes:
- Sample teachers, spectators and students
- Randomized student journal entries
- Seed news articles

---

### Local Development Setup
1. In `backend/`, fill the `.env` file with correct information.
2. Install dependencies:
```bash
cd backend && npm  install
```
3. Set up the database:
- Copy `knexfile.example.js` to `knexfile.js` in the `database/` directory and update it with your MySQL credentials.
- Run migrations and seeds:
```bash
cd database && npm  install
npx knex migrate:latest --env development && npx  knex  seed:run  --env  development
```
4. Start the backend in its own terminal:
```bash
cd backend && npm  run  start
```
5. Start the frontend in its own terminal:
```bash
cd frontend && npm  run  dev
```

The app will have 1 default teacher account:
- Email: `teacher@example.com`
- Password: `salasana`

You can update the account details in the profile page.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please:

1. Fork the repository.

2. Create a new branch for your feature or bug fix.

3. Commit changes with clear commit messages.

4. Push your branch to your forked repository.

5. Open a Pull Request.

---

Thank you for checking out Workout & Academic Progress Tracker! 🎯
