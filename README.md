# Vue3与TSX

## 涉及到的主要依赖

1. `vite@2.0.4`
2. `vue@3.2.0`
3. `pinia`
4. `vue-router@4.0.4`
5. `typescript@4.2.2`

## 准备工作

1. 确保安装`yarn`

```bash
npm install yarn -g
```

2. 确保安装`vite`脚手架

```bash
npm install -g create-vite-app
# or
yarn add -g create-vite-app
```

## 开始

### 项目初始化

```bash
yarn create vite-app <project-name>
```

### 集成TS

```bash
yarn add --dev typescript
```

项目根目录创建配置文件：`tsconfig.json`：

```js
{
  "include": ["./**/*.ts"],
  "compilerOptions": {
    "jsx": "react",
    "target": "es2020" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. */,
    "module": "commonjs" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */,
    // "lib": ["es2017.object"] /* Specify library files to be included in the compilation. */,
    // "declaration": true /* Generates corresponding '.d.ts' file. */,
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    "sourceMap": true /* Generates corresponding '.map' file. */,
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    "outDir": "./dist" /* Redirect output structure to the directory. */,

    "strict": true /* Enable all strict type-checking options. */,
    "noUnusedLocals": true /* Report errors on unused locals. */,
    "noImplicitReturns": true /* Report error when not all code paths in function return a value. */,

    "moduleResolution": "node" /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */,
    "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
  }
}
```

### 集成eslint

```bash
yarn add --dev eslint eslint-plugin-vue
```

项目根目录创建配置文件`.eslintrc.js`：

```js
module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser', // Specifies the ESLint parser
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      // tsx: true, // Allows for the parsing of JSX
      jsx: true,
    },
  },
  // settings: {
  //   tsx: {
  //     version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
  //   }
  // },
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
  },
};
```

### 集成pritter

```bash
yarn add --dev prettier eslint-config-prettier eslint-plugin-prettier
```

项目根目录创建配置文件：`.prettierrc.js`：

```js
module.exports = {
  semi: true,
  trailingComma: "all",
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  endOfLine:"auto"
};
```

到这一步，一个Vue3+TSX的项目就搭建起来了，以上配置文件的具体内容就不做解释了。

### 修改入口文件

因为默认项目模板是以`src/main.js`为入口的，我们需要把它修改为`src/main.ts`。  
在`根目录的index.html`中修改入口文件的引用即可：

```html
... ...
<body>
  ... ...
  <script type="module" src="/src/main.ts"></script>
</body>
</html>

```

### 优化TS类型推断

在src目录下，创建`shim.d.ts、source.d.ts`  

`shim.d.ts`: (这个其实不太需要，因为项目中全是通过tsx开发的)

```ts
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
```

`source.d.ts`: (优化编译器提示，声明静态资源文件)

```ts
declare const React: string;
declare module '*.json';
declare module '*.png';
declare module '*.jpg';
```

### 集成vue-router

```bash
yarn add --dev vue-router@4.0.4
```

这里可以去`npm官网`查找最新版本  
在src目录下，`新建router文件夹`，并在文件夹内`创建index.ts`
`index.ts`:

```js
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

```  

这里创建router的方式与之前不同，在vue3中，结合TS的类型推断，开发效率会高很多。  

### 集成pinia

```bash
yarn add pinia
```

Pinia 是一个 Vue 的存储库，它应该就是vue官方提供的vuex5了，它取消了mutations,更适合组合式API的开发风格,适用于vue3.2以后的版本，之前的版本会报错
在src目录下，新建store文件夹，并在文件夹内创建`index.ts`  

### main.ts

最终main.ts中引入store、router：

```js
import { createApp } from 'vue';
import App from './App';
import router from './router';
import store from './store';

createApp(App).use(router).use(store).mount('#app');
```  

### TSX

最终我们的组件代码，都会是这样的：`App.tsx`:  

```js
import { defineComponent } from 'vue';
import {RouterLink, RouterView} from 'vue-router';
import './style/main.scss'

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <>
        <div id="nav">
          <RouterLink to="/">Home</RouterLink> |
          <RouterLink to="/about">About</RouterLink>
        </div>
        <RouterView/>
      </>
    );
  }
});
```  

### 个人对于tsx的理解

自我感觉vue3对tsx的支持还算不上完美，毕竟vue3对template做了更多的静态支持，tsx现在只应该适用于某些场景下追求极致的选择，相应地需要付出更多开发成本。
