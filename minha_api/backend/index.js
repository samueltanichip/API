const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parse de JSON no corpo das requisições
app.use(express.json());

// "Banco de dados" simples (um array)
let produtos = [
  { id: 1, nome: 'Produto 1', preco: 100 },
  { id: 2, nome: 'Produto 2', preco: 150 },
];

// Rota simples
app.get('/', (req, res) => {
  res.send('Olá, mundo! A API está funcionando.');
});

// Rota para listar produtos
app.get('/produtos', (req, res) => {
  res.json(produtos);
});

// Rota para obter um produto pelo ID
app.get('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const produto = produtos.find(p => p.id === parseInt(id));
  if (!produto) {
    return res.status(404).json({ message: 'Produto não encontrado' });
  }
  res.json(produto);
});

// Rota para criar um novo produto
app.post('/produtos', (req, res) => {
  const { nome, preco } = req.body;
  if (!nome || !preco) {
    return res.status(400).json({ message: 'Nome e preço são obrigatórios' });
  }

  const novoProduto = {
    id: produtos.length + 1,
    nome,
    preco,
  };
  produtos.push(novoProduto);
  res.status(201).json(novoProduto);
});

// Rota para atualizar um produto
app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, preco } = req.body;
  
  let produto = produtos.find(p => p.id === parseInt(id));
  if (!produto) {
    return res.status(404).json({ message: 'Produto não encontrado' });
  }

  produto.nome = nome || produto.nome;
  produto.preco = preco || produto.preco;

  res.json(produto);
});

// Rota para excluir um produto
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const index = produtos.findIndex(p => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Produto não encontrado' });
  }

  produtos.splice(index, 1);
  res.status(204).send();  // No content (sucesso sem resposta)
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://0.0.0.0:${PORT}`);
});















