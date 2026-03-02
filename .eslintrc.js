module.exports = {
  env: {
    "browser": true,
    "es2021": true,
    "node": true
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended",
    './.eslintrc-auto-import.json',
  ],
  overrides: [
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  },
  plugins: [
    "vue",
    "@typescript-eslint"
  ],
  rules: {
    'semi': ['warn', 'always'],                      // 尾部使用分号
    'no-var': 'warn',                                // 禁止出现var用let和const代替
    'eqeqeq': 'warn',                                // 要求使用 === 和 !==
    // 'indent': ['warn', 2],                           // 要求使用JS一致缩进2个空格
    'no-debugger': 'warn',                           // 禁止出现debugger
    'no-self-compare': 'warn',                       // 禁止自身比较表达式
    'no-trailing-spaces': 'warn',                    // 禁止一行结束后面不要有空格
    'no-unreachable': 'warn',                        // 禁止出现[return|throw]之后的代码块
    'vue/multi-word-component-names': 'off',         // 关闭组件驼峰命名规则
    "@typescript-eslint/no-explicit-any": ["off"],   // 关闭使用any触发警告,
    "vue/no-use-v-if-with-v-for": ["error", {
      "allowUsingIterationVar": true  //允许使用迭代变量
    }],
  }
};
