const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signUp = async (req, res) => {
    const {user_name, password, role} = req.body;
    try {
        const account = await Account.findOne({where: {user_name}});
        if (account) {
            res.status(400).json({message: 'Username already exists'});
        }
        const newAccount = await Account.create({user_name, password, role});
        res.status(201).json(newAccount);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const signIn = async (req, res) => {
    const {user_name, password} = req.body;
    try {
        const account = await Account.findOne({where: {user_name}});
        if (!account) {
            res.status(401).json({message: 'Username or password is incorrect'});
        }
        if (account.password !== password) {
            res.status(401).json({message: 'Username or password is incorrect'});
        } else {
            const token = await jwt.sign(
                {id: account.id, user_name: user_name},
                process.env.SECRET_KEY, {
                    // expiresIn: '1h'
                })
            res.status(200)
                .header('Authorization', `Bearer ${token}`)
                .status(200).json(account);
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    signUp,
    signIn
}