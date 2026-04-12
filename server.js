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
    if (!body || !body.nome || !body.email || !body.senha) {
        reply.status(400).send({error: "Nome, email e senha obrigatórios!"})
    }
    const resultado = await sql.query('select * from responsavel where nome = $1, email = $2 AND senha = $3', [body.nome, body.email, body.senha])    

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

    const responsavel = await sql.query('select * from responsavel where id = $1', [id])  
    if (responsavel.rows.length === 0) {
        return reply.status(400).send({
            message: "Usuário não existe!"
        })
    }

    const resultado = await sql.query('UPDATE responsavel SET nome = $1, senha = $2, email = $4 WHERE id = $3', [body.nome, body.senha, id, body.email])      
    reply.status(201).send({message: `Responsável ${body.nome} alterado!`})          
})

servidor.delete('/chamados/:id', async (request, reply) => {
    const id = request.params.id
    const resultado = await sql.query('DELETE FROM responsavel where id = $1', [id]) 
    console.log(resultado);    
    reply.status(200).send({message:'Responsável Deletado!'})
})

servidor.listen({   
    port: 3000
})