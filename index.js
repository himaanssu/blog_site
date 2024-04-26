import express from "express";
const app = express();
const port = 3000;

// Set up middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Temporary storage for posts
let posts = [];

// Define routes
app.get("/", (req, res) => {
    res.render("./index.ejs", { posts });
});

app.post("/create-post", (req, res) => {
    const content = req.body.content;
    const newPost = {
        id: Date.now(),
        content: content
    };
    posts.push(newPost);
    res.redirect("/");
});

app.get("/edit-post/:postId", (req, res) => {
    const postId = req.params.postId;
    const post = posts.find(post => post.id == postId);
    if (!post) {
        res.status(404).send("Page not found.");
        return;
    }
    res.render("./edit.ejs", { post });
});

app.post('/save-edited-post/:postId', (req, res) => {
    const postId = req.params.postId;
    const content = req.body.content;
    const postIndex = posts.findIndex(post => post.id == postId);
    if (postIndex === -1) {
        res.status(404).send('Post not found');
        return;
    }
    posts[postIndex].content = content;
    res.redirect('/');
});

app.post('/delete-post/:postId', (req, res) => {
    const postId = req.params.postId;
    posts = posts.filter(post => post.id != postId);
    res.redirect('/');
});

// Server Start
app.listen(port, () => {
    console.log(`Listening to port: ${port}`);
});