
## PascalCase

### Components
const TeacherHeader = () => {
   ...
}

### Component files
TeacherHeader.jsx
LoginPage.jsx



## camelCase

### All other files that are not components
teacherHeader.css
userService.js

### Functions & Variables
const getFullName = (firstName, lastName) => {
    return `${firstName} ${lastName}`;
}

### Object properties
const user = {
  userName: "student123",
  firstName: "Etunimi",
  lastName: "Sukunimi"
}

### CSS & HTML IDs



## snake-case

### Folders
/frontend/src/pages/new_journal_entry/NewJournalEntry.jsx

## CSS Class names
header-container {
    display: "flex";
}

<div className="header-container">
  ...
</div>



## SCREAMING_SNAKE_CASE

### Constants
const BASE_PATH = "https://domain.services/api";

### Global Variables
const ENVIRONMENT = 'PRODUCTION';
const PI = 3.14159;
