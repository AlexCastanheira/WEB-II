// 1. Instalação e Configuração do Express.js
const express = require('express');
const app = express();

// Middleware para fazer parse de JSON no corpo da requisição
app.use(express.json());





// 3. Middleware de Autenticação Fake
function autenticar(req, res, next) {
  const token = req.headers['autoriza'];

  if (token === '12345678') {
    next();
  } else {
    res.status(401).send('Não autorizado');
  }
}

// Rota protegida com autenticação
app.get('/ola', autenticar, (req, res) => {
  res.send('Bem-vindo ao servidor Express!');
});





// 2. Rotas Dinâmicas com autenticação
app.get('/ola/:nome', autenticar, (req, res) => {
  const nomeUsuario = req.params.nome;
  res.send(`Olá, ${nomeUsuario}!`);
});






// 4. Manipulação de Dados com Query Params
// rota GET sem autenticação para facilitar os testes
app.get('/produtos', (req, res) => {
  const { categoria, preco } = req.query;

  // lista de produtos
  const produtos = [
    { id: 1, nome: 'Celular', categoria: 'eletronicos', preco: 1500 },
    { id: 2, nome: 'Notebook', categoria: 'eletronicos', preco: 3000 },
    { id: 3, nome: 'Mesa', categoria: 'moveis', preco: 500 },
    { id: 4, nome: 'Cadeira', categoria: 'moveis', preco: 800 },
  ];

  let produtosFiltrados = produtos;

  if (categoria) {
    produtosFiltrados = produtosFiltrados.filter(produto => produto.categoria === categoria);
  }

  if (preco) {
    produtosFiltrados = produtosFiltrados.filter(produto => produto.preco <= Number(preco));
  }

  res.send(produtosFiltrados);
});






// 5. Rota POST para adicionar um novo produto com ID único
let produtos = [
  { id: 1, nome: 'Celular', categoria: 'eletronicos', preco: 1500 },
  { id: 2, nome: 'Notebook', categoria: 'eletronicos', preco: 3000 },
  { id: 3, nome: 'Mesa', categoria: 'moveis', preco: 500 },
  { id: 4, nome: 'Cadeira', categoria: 'moveis', preco: 800 },
];

app.post('/produtos', validarProduto, (req, res) => {
  const novoProduto = req.body;
 
  const novoId = produtos.length ? produtos[produtos.length - 1].id + 1 : 1;
  
  const produtoComId = { id: novoId, ...novoProduto };

  produtos.push(produtoComId);

  res.status(201).send(produtoComId);
});





// 6. Middleware de Validação de Dados para a rota POST
function validarProduto(req, res, next) {
  const { nome, categoria, preco } = req.body;

  if (!nome || typeof nome !== 'string') {
    return res.status(400).send({ erro: 'O campo "nome" é obrigatório e deve ser uma string.' });
  }

  if (!categoria || typeof categoria !== 'string') {
    return res.status(400).send({ erro: 'O campo "categoria" é obrigatório e deve ser uma string.' });
  }

  if (preco === undefined || typeof preco !== 'number') {
    return res.status(400).send({ erro: 'O campo "preco" é obrigatório e deve ser um número.' });
  }

  next();
}






// 7. Middleware Global de Tratamento de Erros
app.use((err, req, res, next) => {
  console.error(err.stack); 

  res.status(500).send({
    erro: 'Ocorreu um erro no servidor.',
    detalhes: err.message
  });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
