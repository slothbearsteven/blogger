import express from 'express'
import BlogService from '../services/BlogService';
import { Authorize } from '../middleware/authorize.js';
import CommentService from '../services/CommentService';


let _BlogService = new BlogService().repository

let _CommentService = new CommentService().repository

export default class BlogController {
    constructor() {
        this.router = express.Router()
            //NOTE all routes after the authenticate method will require the user to be logged in to access
            .use(Authorize.authenticated)
            .get('', this.getAll)
            .get('/:id', this.getById)
            .post('', this.create)
            .put('/:id', this.edit)
            .delete('/:id', this.delete)
    }

    async getAll(req, res, next) {
        try {
            let data = await _BlogService.find({})
            return res.send(data)
        } catch (error) { next(error) }

    }

    async getById(req, res, next) {
        try {
            let data = await _BlogService.findById(req.params.id)
            if (!data) {
                throw new Error("Invalid Id")
            }
            res.send(data)
        } catch (error) { next(error) }
    }

    async getComments(req, res, next) {
        try {
            let data = await _CommentService.find({ blogId: req.params.id }).populate("author", 'name')
            return res.send(data)
        } catch (error) { next(error) }
    }


    async create(req, res, next) {
        try {
            //NOTE the user id is accessable through req.body.uid, never trust the client to provide you this information
            req.body.authorId = req.session.uid
            let data = await _BlogService.create(req.body)
            res.send(data)
        } catch (error) { next(error) }
    }

    async edit(req, res, next) {
        try {
            let data = await _BlogService.findOneAndUpdate({ _id: req.params.id, }, req.body, { new: true })
            if (data) {
                return res.send(data)
            }
            throw new Error("invalid id")
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            await _BlogService.findOneAndRemove({ _id: req.params.id })
            res.send("deleted blog")
        } catch (error) { next(error) }

    }

}