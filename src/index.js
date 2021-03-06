// Importamos los dos módulos de NPM necesarios para trabajar
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const Database = require('better-sqlite3');

// Creamos el servidor
const server = express();

// Configuramos el servidor
server.use(cors());
server.use(
  express.json({
    limit: '100mb',
  })
);
server.set('view engine', 'ejs');

// Coniguramos la base de datos
const db = new Database('./src/data/cards.db', { verbose: console.log });

// Arrancamos el servidor en el puerto 4000
const serverPort = process.env.PORT || 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// Escribimos los endpoints que queramos
server.post('/card', (req, res) => {
  if (
    req.body.name !== '' &&
    req.body.job !== '' &&
    req.body.photo !== '' &&
    req.body.email !== '' &&
    req.body.linkedin !== '' &&
    req.body.github !== '' &&
    req.body.palette !== ''
  ) {
    const newCardData = {
      ...req.body,
      id: uuidv4(),
    };

    const insertNewCard = db.prepare(
      'INSERT INTO cards (uuid, name, job, photo, phone, email, linkedin, github, palette) VALUES (?,?,?,?,?,?,?,?,?)'
    );

    insertNewCard.run(
      newCardData.id,
      newCardData.name,
      newCardData.job,
      newCardData.photo,
      newCardData.phone,
      newCardData.email,
      newCardData.linkedin,
      newCardData.github,
      newCardData.palette
    );
    console.log(insertNewCard);
    const localserver = 'http://localhost:4000';
    const herokuApi = 'https://awesome-cards-picateclas.herokuapp.com';

    const responseSuccess = {
      sucess: true,
      cardURL: `${herokuApi}/card/${newCardData.id}`,
    };
    res.json(responseSuccess);
  } else {
    const responseError = {
      sucess: false,
      error: 'Error description',
    };
    res.json(responseError);
  }
});

server.get('/card/:id', (req, res) => {
  console.log(req.params.id);
  const queryCard = db.prepare('SELECT * FROM cards WHERE uuid = ?');
  const userCard = queryCard.get(req.params.id);
  res.render('pages/card', userCard);
  console.log(userCard);
});

const staticServerPath = './src/public-react';
server.use(express.static(staticServerPath));

const staticServerCss = './src/public-css';
server.use(express.static(staticServerCss));
