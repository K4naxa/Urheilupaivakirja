# Naming scheme
## PascalCase

### Components
```jsx
const TeacherHeader = () => {
   ...
}
```

### Component files
```
TeacherHeader.jsx
LoginPage.jsx
```



## camelCase

### All other files that are not components
```
teacherHeader.css
userService.js
```

### Functions & Variables
```jsx
const getFullName = (firstName, lastName) => {
    return `${firstName} ${lastName}`;
}
```

### Object properties
```js
const user = {
  userName: "student123",
  firstName: "Etunimi",
  lastName: "Sukunimi"
}
```

### CSS & HTML IDs
```html
<input id="passwordInput"/>
```

```css
#passwordInput {
  background-color: white;
}
```


## snake-case

### Folders
```
/frontend/src/pages/new_journal_entry/NewJournalEntry.jsx
```

## CSS Class names
```css
header-container {
    display: "flex";
}
```

```html
<div className="header-container">
  ...
</div>
```



## SCREAMING_SNAKE_CASE

### Constants
```js
const BASE_PATH = "https://domain.services/api";
```

### Global Variables
```js
const ENVIRONMENT = 'PRODUCTION';
const PI = 3.14159;
```
