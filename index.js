const Discord = require('discord.js');
let data = require('./data');

const client = new Discord.Client();

client.on('message', (msg) => {

    if(msg.content.charAt(0) !== '!')
    {
        return;
    }

    if(msg.author.bot) return;

    let bells;
    filtered_msg = msg.content.toLocaleLowerCase().split('!').join('');


    
    for(var i = 0; i < data.data.bugs.length; i++)
    {
        if(data.data.bugs[i].Name.toLocaleLowerCase() === filtered_msg)
        {
            msg.channel.send(`The price for ${data.data.bugs[i].Name} is ${data.data.bugs[i].Price} bells`);
            return;
        }
    }

    for(var i = 0; i < data.data.fish.length; i++)
    {
        if(data.data.fish[i].Name.toLocaleLowerCase() === filtered_msg)
        {
            msg.channel.send(`The price for ${data.data.fish[i].Name} is ${data.data.fish[i].Price} bells`);
            return;
        }
    }

    for(var i = 0; i < data.data.arts.length; i++)
    {
        if(data.data.arts[i].Name.toLocaleLowerCase() === filtered_msg)
        {
            let embed = new Discord.RichEmbed();
            
            embed.setTitle(data.data.arts[i].Name);
            embed.setImage(data.data.arts[i].src);
            embed.setDescription(data.data.arts[i].Description);
            msg.channel.send(embed);
            return;
        }
    }

    msg.channel.send("No match found. Either the command is misspelled or does not exist.");
});

client.on('ready', () => {
    console.log("Bot is now connected.")
});
client.login(process.env.api_key);