CREATE DATABASE pdv;

DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(500) NOT NULL
);
DROP TABLE IF EXISTS produtos;

CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(255) UNIQUE NOT NULL,
    valor INT NOT NULL, 
    produto_imagem TEXT
);
DROP TABLE IF EXISTS pedidos;

CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    data TIMESTAMP NOT NULL,
    valor_total INT NOT NULL
);
DROP TABLE IF EXISTS pedido_produtos;

CREATE TABLE pedido_produtos (
    id SERIAL PRIMARY KEY,
    pedido_id INT REFERENCES pedidos(id) NOT NULL,
    produto_id INT REFERENCES produtos(id) NOT NULL,
    quantidade_produto INT NOT NULL
);