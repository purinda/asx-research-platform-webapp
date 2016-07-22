# API Driven CMS in Vue.JS

## Installation

Install dependencies

``` bash
npm install
```

Run the development server
``` bash
npm run dev
```

Open the address `http://127.0.0.1:8080/` on your browser.

## Configuration

Configuration is handled using the following config files found in the `/config` directory
 
 1. `parameters.js` 
 4. `plugins.js`
 2. `menus.js`
 3. `routes.js`

## Application Structure

### Create Page
- Create file in components folder

  ``` html
  # user.vue
  <template>
    <h3>User Lists</h3>
  </template>

  <style>
    // style here
  </style>

  <script>
    // script here
  </script>
  ```
- Register route component in **src/app.js**

  ``` html
  router.map({
    '/user': {
      component: require('./components/user.vue')
    }
  });

  ```

### Add Menu
Open config/menus.js, and modify json data.

``` html
{
  name: 'Dashboard',
  link: '/',
  icon: 'fa-home',
  child: [{
    name: 'Child Dashboard',
    link: '/child',
    icon: 'fa-circle-o',
    }
  ] 
  // child is optional
}
```