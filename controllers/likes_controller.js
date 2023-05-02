const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');
const { model } = require('mongoose');


module.exports.toggleLike = async function (req, res) {

    try {

        // Likes/toggle/?id=abcdf&type=Post
        let likeable;
        let deleted = false;
        let userId = await req.user;

        if (req.query.type == 'Post') {
            likeable = await Post.findById(req.query.id).populate('likes');
        }
        else {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }


        // Check if a like already exists
        let exstingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: userId.id
        })


        // If a like already exists then delete it
        if (exstingLike) {
            likeable.likes.pull(exstingLike._id);
            likeable.save()

            exstingLike.deleteOne();
            deleted = true
        }
        else {

            // else make a new like
            let newLike = new Like({
                user: userId._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            await newLike.save()

            likeable.likes.push(newLike._id);
            likeable.save();

        }

        return res.json(200, {
            message: 'Request successful!',
            data: {
                deleted: deleted
            }
        })


    } catch (error) {
        console.log(error);
        return res.json(500, {
            message: 'Internal Server Error'
        })

    }
}