# Delilah

_Proyecto 3 de back-end Delilah Restó de Acamica_

## Comenzando

_Estas instrucciones te serviran para poder instalar correctamente lo mínimo necesario para el funcionamiento del proyecto._

### Pre-requisitos 📋

_Es necesario tener instalados los siguientes programas_

* [NodeJS](https://nodejs.org/en/) - Maquina virtual de JS para ejecutar el proyecto.
* [Mariadb](https://mariadb.org/) - Manejador para la base de datos.
* [Swagger](https://editor.swagger.io/) o [Postman](https://www.postman.com/) - Necesarios para realizar pruebas.

### Instalación 🔧

_Una vez instalados los programas necesario debe clonarse el repositorio en una carpeta local_

### Mariadb

> Durante la instalacion de **Mariadb** pedira un usuario y contraseña en los cuales se uso _**root**_ para ambos. 
> AL terminar la instalacion es necesario asegurarse de agregarlo a las variables de entorno la ruta sera similar a:
> C:\Program Files\MariaDB 10.5\bin

Datos  usuario y password en la instalación de **Mariadb** :

* **User**: root
* **Password**: root
* **Puerto**: 3306

Para verificar que Mariadb este correctamente instalado y en las variables de entorno ejecutamos en una terminal:

```
mariadb -u usuario -p
```

Si esta correctamente instalado nos pedira ingresar el password del usuario.

Una vez dentro necesitamos crear la base de datos de la aplicacion, esto se hace ejecutando el siguiente comando y presionando enter:

```
create database delilah;
```

Posteriormente ingresamos el siguiente comando para instalar la base de datos:

```
mysql delilah < delilah.sql
```
> Para que este comando funcione la terminal debe estar abierta en la carpeta db del repositorio, de lo contrario
> es necesario colocar la ruta completa de la ubicación de archivo de la siquiente manera 
> **C:\Users\e_mma\Desktop\delilah\db\delila.sql**

### Delilah Resto con NodeJS

Entramos a la carpeta local de nuestro repositorio y abrimos una terminal y ejecutamos el siguiente comando:

```
npm install
```

Con esto se instalaran las dependencias necesarias que se especificaron en el package.json.

_Una vez finalizada la instalacion de las dependencias ejecutamos el siguiente comando para iniciar el servidor._

```
npm run start
```

## Ejecutando las pruebas ⚙️

_Una vez iniciado el servidor podemos importar el archivo_ **.yaml** _en [Swagger Editor](https://editor.swagger.io/) o importar 
el_ **.json** _en [Postman](https://www.postman.com/) para probar los servisios de la aplicacón._

Estos archivos se encuentran en la carpeta pruebas.

## Autor ✒️

* **Omar Emmanuel Aceves Amador** - *Desarrollador* - [omaraceves1007](https://github.com/omaraceves1007)
