# Insta-Clone

This is a Instagram like website that allows users to upload images and follow
other users.

## Features

* Upload images from desktop or mobile phone.
* Follow users and view a feed of posts by followed users.
* Users can set a profile visibility at public (all can see), followers only
  (only people that they follow can see), and private (only they can see).

## Building / Running

In order to run Insta-Clone requires NPM, Node, and MongoDB. Once you've cloned
the repo and have started a MongoDB server navigate to `backend/` and create a
`.env` file. Set the values to the correct MongoDB server and a port marching
that in the front-end project's proxy.

```
PORT=8000
SECRET='MYsecret'
MONGODB_URL='mongodb://127.0.0.1:27017'
```

Then while still in `backend/`

```
npm install && npm start
```

Then in a different terminal navigate to the `frontend/` directory and run the
following:

```
npm install && npm start
```
