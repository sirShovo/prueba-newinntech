# Prueba-Newinntech - API

Esta es una API para registrar usuarios y subir sus fotos.
Tiene integraciones con MYSQL, S3, dotenv, express, JWT, multer y nodemailer.

Para instalar las dependencias es necesario el uso de `NodeJS` y `npm` 

**Install**
```sh
npm install
```
**Run**
```sh
npm run dev
```


## `POST` /register
Nos ayuda a registrar usuarios y les envia un correo electronico para confirmar la cuenta, recibe 2 
parametros en el body.

**Body**

```sh
{
    "email": string | email,
    "password": string
}
```

## `GET` /confirm/:token
Esta ruta confirma nuestro correo electronico despues de registrarnos, nos llega al correo electronico un link junto con el token que es un parametro para esta ruta 

**Query params**
| Key | Value |
| ------ | ------ |
| token | { token } |

## `GET` /login
Es la entrada a nuestro sistema, tambien recibe dos parametros en el body y es la ruta que nos da
el acceso al resto del sistema gracias al JWT.

**Body**
```sh
{
    "email": string | email,
    "password": string
}
```

**Response**
```sh
{
    "message": string,
    "token": string
}
```

## `GET` /get-data
Es el punto de acceso para entender la informacion que nos brinda el JWT, este tiene un parametro en los headers.

**Headers**
| Key | Value |
| ------ | ------ |
| Authorization | { token } |

**Response**
```sh
{
  "user": {
    "id_user": id,
    "email": string | email,
    "password": string,
    "created": date,
    "photo": string,
    "verified": boolean,
    "iat": timestamp,
    "exp": timestamp
  }
}
```

## `GET` /forgot
Una ruta diseñada para recuperar la contraseña en caso tal de que se nos olvide, solo nos pide un parametro en el body.

**Body**
```sh
{
    "email": string | email,
}
```

## `POST` /recovery
Esta ruta recibe 2 parametros, uno por el body y otro por los headers. Nos ayuda a cambiar la contraseña cuando la hemos 
olvidado y ya tenemos el token de autorizacion para cambiarla.

**Headers**
| Key | Value |
| ------ | ------ |
| Authorization | { token } |

**Body**
```sh
{
    "password": string,
}
```

## `POST` /upload
Con esta ruta podemos subir la imagen de un usuario, para ello necesitamos del token como parametro en los headers y del archivo en el body.

**Headers**
| Key | Value |
| ------ | ------ |
| Authorization | { token } |

**Body**
```sh
{
    "photo": file,
}
```

**Response**
```sh
{
  "msg": string,
  "newToken": string,
  "s3": {
    "ETag": string,
    "ServerSideEncryption": string,
    "Location": url,
    "key": string,
    "Key": string,
    "Bucket": string
  }
}
```

