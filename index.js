const express = require('express');
const cors = require('cors');
const app = express();
const { Client, Chat } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');



// cors middleware  
app.use(cors());
app.use(express.json())

const client = new Client({
});
  
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!'); 
    console.log('My contacts'); 
    client.getChats().then((chats) => {
    for(let i = 0; i < chats.length; i++){
        console.log(chats[i].id.user + " " + chats[i].name)
    }    
    console.log("Listening for incoming messages")
    })
 

});
client.on('message', message => {
    let time = new Date(message.timestamp).toLocaleTimeString("en-US")
    console.log("=============")
    console.log(time)
    console.log(message.from.slice(0, -5));
    console.log(message.body)  
});

client.on('message', message => {
	if(message.body === 'ping') {
		client.sendMessage(message.from, 'pong');
	}
});

client.initialize();


app.post("/send", async (req, res) => {
try {
    const {phone_number, msg} = req.body
    const to = phone_number + "@c.us"
    client.sendMessage(to, msg); 
    console.log("sent")
    res.sendStatus(200)
} catch (error) {
    console.error(error);
    res.json({"msg": "error"})    
}})

// app.get("/chat_history", async (req, res) => {
// try {
//     const searchOptions = {
//         limit: Infinity,
//         fromMe: undefined
//     }
//     await chat.fetchMessages(searchOptions).then((messages) => {
//         console.log(messages)
// })
//     console.log(chat_history)
//     res.sendStatus(200)
// } catch (error) {
//     console.error(error);
//     res.json({"msg": "error"})    
// }})



//running server
const PORT = process.env.PORT || 5200;
app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));

