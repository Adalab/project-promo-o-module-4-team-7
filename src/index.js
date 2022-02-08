// Importamos los dos módulos de NPM necesarios para trabajar
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const Database = require('better-sqlite3')

// Creamos el servidor
const server = express();

// Configuramos el servidor
server.use(cors());
server.use(express.json({
  limit:'100mb'
}));
server.set('view engine', 'ejs');

// Coniguramos la base de datos
const db = new Database('.src/data/cards.db', {verbose: console.log})

// Arrancamos el servidor en el puerto 4000
const serverPort = process.env.PORT || 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

const savedCards = [];

// Escribimos los endpoints que queramos
server.post('/card', (req, res) => {
  if (req.body.name !== '' && req.body.job !== '') {
    const newCardData = {
      ...req.body,
      id: uuidv4(),
    };
    savedCards.push(newCardData);
    console.log(savedCards);
    const responseSuccess = {
      sucess: true,
      cardURL: `https://awesome-cards-picateclas.herokuapp.com/card/${newCardData.id}`,
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
  const userCard = savedCards.find((card) => card.id === req.params.id);
  res.render('pages/card', userCard);
});

const staticServerPath = './src/public-react';
server.use(express.static(staticServerPath));

const staticServerCss = './src/public-css';
server.use(express.static(staticServerCss));
