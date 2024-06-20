# My TypeScript Journey: Earned Badges 🏆

## Badges Overview

Here is a collection of badges I earned from completing Microsoft Learn's TypeScript modules:

1. **Getting Started with TypeScript**: [Badge](https://learn.microsoft.com/en-us/users/koshmandmitri-6014/achievements/3x54jvnh)
2. **Declare Variable Types in TypeScript**: [Badge](https://learn.microsoft.com/api/achievements/share/en-us/KoshmanDmitri-6014/9NTE9NCU?sharingId=31EEF97E60BF23DF)
3. **Implement Interfaces in TypeScript**: [Badge](https://learn.microsoft.com/en-us/users/koshmandmitri-6014/achievements/ufskujv3)
4. **Develop Typed Functions in TypeScript**: [Badge](https://learn.microsoft.com/api/achievements/share/en-us/KoshmanDmitri-6014/4SZZLBLK?sharingId=31EEF97E60BF23DF)
5. **Declare and Instantiate Classes in TypeScript**: [Badge](https://learn.microsoft.com/api/achievements/share/en-us/KoshmanDmitri-6014/X2UUSU6Y?sharingId=31EEF97E60BF23DF)
6. **Generics in TypeScript**: [Badge](https://learn.microsoft.com/api/achievements/share/en-us/KoshmanDmitri-6014/AQ888Z27?sharingId=31EEF97E60BF23DF)
7. **Work with External Libraries in TypeScript**: [Badge](https://learn.microsoft.com/api/achievements/share/en-us/KoshmanDmitri-6014/WA6CYEBN?sharingId=31EEF97E60BF23DF)
8. **Organize Code with Namespaces in TypeScript**: [Badge](https://learn.microsoft.com/api/achievements/share/en-us/KoshmanDmitri-6014/EJ7B9V2P?sharingId=31EEF97E60BF23DF)

## Reflections

- **Getting Started with TypeScript**  
*Typescript is s a superset of JavaScript. It is a powerful tool prudocing a lot benefits. TypeScript has type system. Browsers don't support TS, so you need transform JS to TS by  using the TypeScript compiler. To install TS you need npm (install Node.js). TypeScript can be used everywhere, it will predict and eliminate many problems.*
- **Declare Variable Types in TypeScript**  
*You should declare variables to prevent unexpected results, to make code more understandable for you and other developers. To declare type you need to use syntax 'varName: type'. There are subtypes of any type: primiteves (boolean, number, integer, etc), object and parameters types. Usefull type is enum. You can use it when there is a set of values. In most cases you should avoid type 'any', cause you loose TpeScript`s advantages. Otherwise you can use type 'unknown', type assertion or other techniques. Also you can declare several types - use union types (syntax '|'). If you need to combine two or more types use ampersand to separate each type, or you can use lyteral types to provide exact values to variables. Object type such as array declare syntax: 'primitive[]' or "Array<'type'>". If array has different values, use tuples.* This is basic of TS which should be known and used anywhere by situation in projects.
- **Implement Interfaces in TypeScript**  
*TypeScript has interfaces which describe how the object instances should look like, define types of it`s parameters (values). Implementation of this properties - is the task of created instances (e.g. fulfill contract). Interfaces exist only during developing and not in runtime. The main different from type alias is that you can add new properties whereas type alias doesn't. Interface can be extended each other, so creation new instances become more flexible. On another way you can create indexable types for example for your own unique array type. So, you may and must use interface, cause it very usefull in team-work: there is no need for someone to know how you implemented object methods, he knows that object has definite properties which he can use. And its useful clue to not ommit properties, which sholud be announce in object.*
- **Develop Typed Functions in TypeScript**  
*In TypeScript function parameters are always required when in JavaScript - no. But you can make them optional with syntax '?' or declare value by default same as in JS. Like in JS you may use function expression, declaration, arrow functions. In TS also you can use deconstruction and rest parameters. Syntax the same like in JS. In projects you should always add types to functions to prevent yourself from passing values that you shouldn't pass to your functions or return the value you are expected.*
- **Declare and Instantiate Classes in TypeScript**  
*Classes in TypeScript similar to JS with some specific features. Syntax using in TS class the same as in JS: properties, constructor, getters/setters and methods. Here is the difference: if you omit get or set, the property become inaccessible. Also like in JS, TS allow to work with access modifier: public, private, protected. There is no difference with JS. But you shold remember, that TypeScript as structural type system, when comparing types with private or protected acess, compare not only a type but access modifier. Also there are static and public properties in TS. Extending classes has the same syntax as in JS (extends, super, overriding, etc.). The different feature from JS - using interface to describe class instance shape. As previous interfaces useful to ensure you working with instances without missing smth. If you need only define data structure - use interface, if you need to describe beahviour of the object or another implemention details - use classes.*
- **Generics in TypeScript**  
*Generic is like a template where you can you any type depending on situation. It has syntax <'T'>, you can use any name of generic you want. Generics can be used multiple in one object, function. To protect you from unexpected values in run-time there are generic constraints and type guards when using type variables to create generics. For primitives use 'typeof' type checking, for classes - 'instanceof'. Another useful thing is generics with custom types and classes. It`s syntax is <'generic extends extandable'>. In real projects use generics when your function or class works with various data types, or you can reuse it in several places with different types of data. Generics provide wide flexibility to your code, more reusability and save type checking opportunity.*
- **Work with External Libraries in TypeScript**  
*TypeScript provides two ways to organize you code: namespaces and modules. Modules is ES6 feature, that also supported by TypeScript. To export something use export keywaord or import keyword to import ane declaration. Again TS use syntax from JS. This can be named export, default export, export all module and etc like in JS. TS needs to compile modules in one file. For that use command "tsc --module <'compiler'> <'target file'>". TapeScript allows to import libraries. So due to many libraries may not have type declaration, you deen to install them by using prefix @types, that way TS will not throw error. Often libraries arenot needed in production, so in your projects install them with devDependencies, using --save-dev flag.*
- **Organize Code with Namespaces in TypeScript**  
*There two ways to organize code in TypeScript: modules and namespaces. Unlike modules namespace allow you to keep code in one file with the same names of variables and functions, intefaces, classes ... - grouping them. The code inside will pull from the global scope. To contact with you must use namespace name. It is good opportunity to reduce naming collisions. You can also nest namespaces within namespaces.  
If you want to share namespaces across multiple TypeScript files, there is special syntax and rules. Use triple slash ( /// ) on the top pf the file and add reference path, so like you importing modules. If there are more than one reference, TypeScript will compile them in order from top. Its a lot difference between namespaces and modules. Modules are recommended for code organization due to their benefits: declare their dependencies, better code reuse, provide better tooling support for bundling, can resolve top-down flow and others. So, for the new projects use modules.*