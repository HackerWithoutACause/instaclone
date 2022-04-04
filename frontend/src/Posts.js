import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import './Posts.sass';

const Posts = (props) => {
    const [posts, setPosts] = useState([]);

    const refreshPosts = async () => {
        let res;

        if(props.username)
            res = await fetch('/posts/' + props.username);
        else
            res = await fetch('/posts');

        setPosts(await res.json());
    };

    useEffect(async () => {
        await refreshPosts();
    }, []);

    const like = (id, action) => {
        return async (e) => {
            const data = JSON.stringify({ post: id });
            const res = await fetch('/' + action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: data,
            });
            await refreshPosts();
        };
    };

    const post = (post) => {
        return (
            <div key={post._id} className='post' onDoubleClick={like(post._id, post.hasLiked ? 'unlike' : 'like')}>
                <img src={'/uploads/' + post.image} />
                <div className='info'>
                    <Link className='double' to={'/@' + post.author}>{ post.displayName } (@{post.author})</Link>
                    <button
                        onClick={like(post._id, post.hasLiked ? 'unlike' : 'like')}
                        className={ 'like ' + (post.hasLiked ? 'liked' : 'unliked') }>
                        <FontAwesomeIcon className='solid' icon={ faHeart } />
                        <FontAwesomeIcon className='outline' icon={ faHeartOutline } />
                    </button>
                    Posted <span className='date'>{new Date(post.uploaded).toLocaleDateString('en-us', { year:"numeric", month:"long", day:"numeric" })}</span>
                    <span className='double'>Likes</span> <span>{post.likes}</span>
                </div>
            </div>
        );
    };

    return (
        <div className='posts'>
            { posts && posts.length !== 0 ? posts.map(post) : <h2 className='posts-inductor'>No posts yet</h2> }
        </div>
    );
};

export default Posts;
