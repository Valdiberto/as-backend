import { Request,  Response, RequestHandler } from "express";
import { z } from "zod";
import * as auth from '../services/auth'

export const login: RequestHandler = (req, res) => {
    const loginSchema = z.object({
        password: z.string()
    })
    const body = loginSchema.safeParse(req.body)
    if(!body.success) {
        res.json({ error: 'Dados inválidos'})
        return 
    }

        // Validar  a senha e gerar o token
         if(!auth.validatePassword(body.data.password)) {
            res.status(403).json({  error: 'Acesso Negado'})
            return  
         }

         res.json ({ token: auth.createToken()})
    
        
        // Retorno da requisição

}

export const validate: RequestHandler = (req, res, next) => {
    if(!req.headers.authorization) {
        res.status(403).json({ error: 'Acesso Negado'})
        return
    }

    const token = req.headers.authorization.split(' ')[1]
    if(!auth.validateToken(token)) {
        res.status(403).json({ error: 'Acesso Negado'})
        return
    }

    
    next()
}
