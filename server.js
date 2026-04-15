import Fastify from 'fastify'
import { Pool } from 'pg'
import cors from '@fastify/cors'

const sql = new Pool({
    user: "postgres",
    password: "senai",
    host: "localhost",
    port: 5432,
    database: "sistema_chamados"
})

const servidor = Fastify();

servidor.register(cors, {
    origin: '*'
});


servidor.post('/login', async (request, reply) => {
    const body = request.body;
    if (!body || !body.nome || !body.senha || !body.email) {
        reply.status(400).send({error: "Nome, email e senha obrigatórios!"})
    }
    const resultado = await sql.query('select * from responsavel where nome = $1 AND senha = $2 AND email = $2' [body.nome, body.senha, body.email])    

    if (resultado.rows.length === 0) {
        reply.status(401).send({message: "Usuário ou senha inválidos!", login: false})
    } else if (resultado.rows.length === 1) {
        reply.status(200).send({message: "Conta logada", login: true})
    }

})


servidor.get('/responsavel', async () => {
    const resultado = await sql.query('select * from responsavel')
    return resultado.rows
})

servidor.post('/responsavel', async (request, reply) => {
    const body = request.body;

    if (!body || !body.nome || !body.senha || !body.email) {
        return reply.status(400).send({
            message:"nome, email e senha são obrigatórios!"
        })
    }

    const resultado = await sql.query('INSERT INTO responsavel (nome, senha, email) VALUES ($1, $2, $3)', [body.nome, body.senha, body.email])          
    reply.status(201).send({message: 'Usuário Criado!'})
})

servidor.put('/responsavel/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;

    if (!body || !body.nome || !body.senha || !body.email) {
        return reply.status(400).send({
            message: "nome, email e senha são obrigatórios!"
        })
    } else if (!id) {
        return reply.status(400).send({
            message: "Faltou o ID!"
        })
    }

    const responsavel = await sql.query('select * from responsavel where id_responsavel = $1', [id])  
    if (responsavel.rows.length === 0) {
        return reply.status(400).send({
            message: "Usuário não existe!"
        })
    }

    const resultado = await sql.query('UPDATE responsavel SET nome = $1, senha = $2, email = $3 WHERE id_responsavel = $4', [body.nome, body.senha, body.email, id])      
    reply.status(201).send({message: `Responsável ${body.nome} alterado!`})          
})

servidor.get('/chamados', async () => {
    const resultado = await sql.query('select * from chamado')
    return resultado.rows
})

servidor.post('/chamados', async (request, reply) => {
    const body = request.body;

    if (!body || !body.titulo || !body.descricao) {
        return reply.status(400).send({
            message:"título, descrição e id do responsável obrigatórios!"
        })
    }

    const resultado = await sql.query('INSERT INTO chamado (titulo, descricao, id_responsavel) VALUES ($1, $2, $3)', [body.titulo, body.descricao, body.id_responsavel])          
    reply.status(201).send({message: 'Chamado Criado!'})
})


servidor.delete('/chamados/:id', async (request, reply) => {
    const id = request.params.id
    const resultado = await sql.query('DELETE FROM chamado where id = $1', [id]) 
    console.log(resultado);    
    reply.status(200).send({message:'Responsável Deletado!'})
})

servidor.put('/chamados/:id', async (request, reply) => {
    const body = request.body;
    const id = request.params.id;

    if (!body || !body.titulo || !body.descricao) {
        return reply.status(400).send({
            message: "Titúlo, descrição do responsável são obrigatórios!"
        })
    } else if (!id) {
        return reply.status(400).send({
            message: "Faltou o ID!"
        })
    }

    const chamado = await sql.query('select * from chamado where id = $1', [id])  
    if (chamado.rows.length === 0) {
        return reply.status(400).send({
            message: "Chamado não existe!"
        })
    }

    const resultado = await sql.query('UPDATE chamado SET titulo = $1, descricao = $2, id_responsavel = $3 WHERE id = $4', [body.titulo, body.descricao, body.id_responsavel, id])      
    reply.status(201).send({message: `Responsável ${body.titulo} alterado!`})          
})
servidor.listen({   
    port: 3000
})