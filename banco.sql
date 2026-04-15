CREATE TABLE IF NOT EXISTS responsavel (
    id_responsavel SERIAL PRIMARY KEY,
    nome Varchar(255) NOT NULL,
    email Varchar(255) NOT NULL UNIQUE,
    senha VARCHAR(12) NOT NULL
);


CREATE TABLE IF NOT EXISTS chamado (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao text NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_responsavel INTEGER NOT NULL REFERENCES responsavel(id_responsavel) ON DELETE CASCADE
);

