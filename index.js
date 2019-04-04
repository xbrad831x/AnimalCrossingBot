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
    filtered_msg = msg.content.toLocaleLowerCase().split('!').join('').trim();

    //!buy set price x set bells x

    if(filtered_msg.includes('buy'))
    {
        array = filtered_msg.split(" ");

        result = 0;

        if(array.length != 7)
        {
            msg.channel.send("Incorrect usage of command.")
            return;
        }

        result = array[6] / array[3];

        if(Number.isNaN(result))
        {
            msg.channel.send("Bad number format. Please write the numbers like the following example: !buy set price 100 set bells 100")
            return;
        }

        msg.channel.send(`You can buy ${Math.floor(result)} turnip(s).`)

        return;
    }

    if(filtered_msg.includes('sell'))
    {
        array = filtered_msg.split(" ");

        result = 0;

        if(array.length != 7)
        {
            msg.channel.send("Incorrect usage of command.")
            return;
        }

        result = array[6] * array[3];

        if(Number.isNaN(result))
        {
            msg.channel.send("Bad number format. Please write the numbers like the following example: !buy set price 100 set bells 100")
            return;
        }

        msg.channel.send(`${array[6]} turnips for ${array[3]} bells each, sells for ${Math.floor(result)} bells.`)

        return;
    }

    if(filtered_msg.includes('fortune'))
    {
        arr = filtered_msg.split(" ");

        if(arr[1] > 57 || isNaN(arr[1]))
        {
            msg.channel.send("Incorrect fortune number. Must be between 1 & 57.");
            return;
        }

        for(var i = 0; i < data.data.fortunes.length; i++)
        {
            if(data.data.fortunes[i].Number.toLocaleLowerCase() === arr[1])
            {
                msg.channel.send(`A #${arr[1]} fortune give you a(n) ${data.data.fortunes[i].Name}.`);
                return;
            }
        }
    }
    
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

    for(var i = 0; i < data.data.fossils.length; i++)
    {
        if(data.data.fossils[i].Name.toLocaleLowerCase() === filtered_msg)
        {
            msg.channel.send(`The price for ${data.data.fossils[i].Name} is ${data.data.fossils[i].Price} bells`);
            return;
        }
    }

    msg.channel.send("No match found. Either the command is misspelled or does not exist.");
});

client.on('ready', () => {
    console.log("Bot is now connected.")
});
client.login(process.env.api_key);