# Obraschillan

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

##Backend

El proyecto incluye una carpeta llamada backend, en donde se estructura cada una de la repsuestas necesarias para el funcionamiento de 
nuestra aplicación.
`npm start` basta para correr el servido estando situado en la carpeta raíz de este (/backend/). Importante ejecutar `npm install`, para las dependencias
y generación de la carpeta node_modules.
La ruta es http://localhost:3000/

## Frontend

Basta ejecutar `ng serve` para iniciar, y el la dirección es `http://localhost:4200/`. IMportante ejecutar `npm install` 
para las dependencias y generación de la carpeta node_modules.

##DB

La base de datos utilizada es MySQL, en donde con una cuenta de la universidad, heredada del semestre anterior, nos conectamos de forma remota, facilitando el trabajo
en grupo al mantener los datos centralizados. Los datos de la conexión estan dentro de un archivo `.env` en la raíz del backend.

##CREDENCIALES

Existen 3 Roles:
    Ciudadano - Email:robles@gmail.com - Contraseña:Robles123 (Es recomendable que se registre en la plataforma, 
                para así aprovechar y probar las funcionalidades que requieren de su correo)
                Es aquí donde se puede ingresar un reporte y ver los ingresados por el mismo usuario.
    Encargado (Dirección de Obras públicas) - Email:matiasq16@gmail.com - Contraseña:Quezada123 
                Es aquí donde se revisan los reportes asociados al tipo de encargado, el cual se filtra por la 
                categoría que ingresa el usuario (ciudadano) en el ingreso del reporte. Para este encargado, las categorías
                que se le asignan son: Luminarias, Calle Sucia, Obstrucción Natural.
    Encargado (Dirección del Tránsito) - Email: e876543211998@gmail.com - Contraseña:Sepulveda123
                A este encargado se le asignan los reportes asociados a la categoría: Tránsito.
                Son estos Encargados los que generan las propuestas relativas a cada reporte, con los datos de costo y detalles.
    Finanzas: Email:matty.97.mp@gmail.com - Contraseña:Poblete123
                Existen dos, pero a diferencia de los Encargados, no se filtra por algún atríbuto para asignar las propuestas si no que,
                Cada uno puede ver todas, y al rechazarla o aceptarla, queda registrado quién llevó a cabo tal acción.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
