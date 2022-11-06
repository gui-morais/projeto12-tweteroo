import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const users = [
    {
        username:"bobesponja",
        avatar:"https://yt3.ggpht.com/ytc/AMLnZu9tYPIG3bxki2LZz-NRrvHtLHRL0-wW95Cjgcr2=s900-c-k-c0x00ffffff-no-rj"
    },
    {
        username:"patrick",
        avatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcBijzv03jYbybd4to1hnAGDAG5EtBgTJsUw&usqp=CAU"
    },
    {
        username:"molusco",
        avatar:"https://pbs.twimg.com/profile_images/409413126/lulamolusco2_400x400.jpg"
    }
];

let tweets = [
    {
        username:"bobesponja",
        tweet:"Eu gosto de encher o saco das pessoas que eu amo"
    },
    {
        username:"patrick",
        tweet:"Sei lá, acho que minha vida tá coisada"
    },
    {
        username:"molusco",
        tweet:"Acredite na fantasia que vc quiser mas faça isso longe de mim"
    }
];

app.post("/sign-up",(req,res) => {
    const { username, avatar } = req.body;
    if(!username||!avatar) {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }
    if(users.find(user => user.username===username)) {
        res.status(409).send("Usuário já cadastrado!");
        return
    }
    users.push({username,avatar});
    res.status(201).send("OK");
});

app.post("/tweets",(req,res) => {
    const username = req.headers.user;
    const tweet = req.body.tweet;

    if(!username) {
        res.status(400).send("Campo Header inválido");
        return;
    }
    if(!tweet) {
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    tweets = [{username,tweet},...tweets];
    res.status(201).send("OK");
});

app.get("/tweets", (req,res) => {
    const page = Number(req.query.page);
    if(!page||page<1||(page-1)*10>tweets.length) {
        res.status(400).send("Informe uma página válida!");
        return;
    }

    const tweetsReturned = [];
    for(let i=(page-1)*10; i<tweets.length&&i<page*10;i++) {
        const tweet = {
            username:tweets[i].username,
            avatar:users.find(user => user.username===tweets[i].username).avatar,
            tweet: tweets[i].tweet
        };

        tweetsReturned.push(tweet);
    }
    res.send(tweetsReturned);
});

app.get("/tweets/:USERNAME",(req,res) => {
    const user = users.find(user => user.username === req.params.USERNAME);
    if(!user) {
        res.status(400).send("Usuário não encontrado");
        return;
    }
    const tweetsFiltered = tweets.filter(tweet => tweet.username===user.username);
    tweetsFiltered.forEach(tweet => tweet.avatar = user.avatar);
    res.send(tweetsFiltered);
});

app.listen(5000, () => {
    console.log("Rodando em http://localhost:5000");
  });