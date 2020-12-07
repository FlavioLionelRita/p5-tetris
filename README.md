# Tetris
software characterictis
- javascript
- node
- p5

# Exercise 1
* completar las demas clases correspodientes a los tipos de figura.
* crear un matriz de 10 x 20  y a partir de esta dibujar una cuadricula  
     info: crear la matriz a partir de un array de 10 elementos donde cada elemento tiene una matriz de 20 elementos. 
* agregar a la funcion updatePosition la rotacion cuando se preciona keyIsDown(UP_ARROW) 

# Exercise 2
## Avance
* Se creo una clase Shape con las propiedades y metodos asociados al Shape
* Se modifico la clase Piece para que reciba un shape como parametro
* Se definio por configuracion los distintos tipos de shapes
* Se definio por configuracion diferentes strategias para obtener la proxima pieza
* Se creo una clase por cada tipo de estrategia
* Se creo la clase Game     
## Tarea

* con drawIO crear un diagrama que contenga todas las clases.
* recorer el codigo y ver si se puede reemplazar for por ForEach, o donde se pueda reemplazar codigo por funciones lambda.
  - [reference](https://lenguajejs.com/javascript/caracteristicas/array-functions/)
* Leer sobre TypeScript
  - [reference](https://softwarecrafters.io/typescript/typescript-tutorial-javascript-introduccion) 
  - [enable tsc en windows](https://www.youtube.com/watch?v=hMtmLTsxdAM) 



## use p5 with TypeScript
https://codesandbox.io/s/8rgs6?file=/src/app.ts:383-399


https://livebook.manning.com/book/typescript-quickly/chapter-10/v-9/87
https://geeks.ms/adiazcervera/2015/09/06/typescript-iv-utilizacin-de-libreras-de-terceros/



tsc -p .\src\server\tsconfig.server.json 

# Webpack

https://www.campusmvp.es/recursos/post/webpack-que-es-para-que-sirve-y-sus-ventajas-e-inconvenientes.aspx


# generar en el server
tsc -p .\src\server\tsconfig.server.json 

