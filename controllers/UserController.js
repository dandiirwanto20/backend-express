//import express
const express = require("express");

//import prisma client
const prisma = require("../prisma/client");

const { validationResult } = require("express-validator");

const bcrypt = require('bcryptjs')

//function findUsers
const findUsers = async (req, res) => {
    try {

        //get all users from database
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,    
            },
            orderBy: {
                id: "desc",
            },
        });

        //send response
        res.status(200).send({
            success: true,
            message: "Get all users successfully",
            data: users,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

const createUser = async (req, res) => {

    // make sure validation result
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        // if error, return error to user
        return res.status(422).json({
            success: false,
            message: "Validation Error",
            errors: errors.array(),
        })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    try {
        // insert data
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            }
        })

        res.status(201).send({
            success: true,
            message: "User created successfully",
            data: user,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Invalid server error"
        })
    }
}

const findUserById = async (req, res) => {

    // get ID from params
    const { id } = req.params
    try {
        // get user by id
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        // send response
        res.status(200).send({
            success: true,
            message: `Get User By ID :${id}`,
            data: user,
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
        })
    }
}

const updateUser =  async (req, res) => {
    // get id user
    const { id } = req.params

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        // if error, return to user
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array()
        })
    }

    // hash password
    hashedPassword = await bcrypt.hash(req.body.password, 10)

    try {
        // update user
        const user = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            }
        })

        //  send response
        res.status(200).send({
            success: true,
            message: 'User updated successfully',
            data: user,
        })
    } catch (error) {
        // send error
        res.status(500).send({
            success: false,
            message: 'Internal Server Error',
        })
    }
}
const deleteUser = async (req, res) => {
    // get id from param
    const { id } = req.params
    
    try {
        // delete user
        await prisma.user.delete({
            where: {
                id: Number(id),
            }
        })

        res.status(200).send({
            status: true,
            message: 'User deleted successfully',
        })
    } catch (error) {
        res.status(500).send({
            status: false,
            message: 'Invalid Server Error'
        })
    }
}

module.exports = { findUsers, createUser, findUserById, updateUser, deleteUser };