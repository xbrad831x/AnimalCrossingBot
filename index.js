const Discord = require('discord.js');
let data = require('./data');
const { Client } = require("pg");


const conn = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
})

conn.connect();

const client = new Discord.Client();

client.on('message', (msg) => {

    if(msg.content.charAt(0) !== '!')
    {
        return;
    }

    if(msg.author.bot) return;

    let bells;
    filtered_msg = msg.content.toLocaleLowerCase().split('!').join('').trim();

    if(filtered_msg.includes('search'))
    {
        search = filtered_msg.split("search ");

        if(search.length <= 1) 
        {
            msg.channel.send("No match found. Either the command is misspelled or does not exist.");
            return;
        }

        item = search[1].trim();

        id = msg.author.id;

        for(var k = 0; k < data.data.donations.length; k++)
        {
            if(item.toLocaleLowerCase() == data.data.donations[k].toLocaleLowerCase())
            {
                search_query_text = "select * from users where id=$1 and item=$2"
                value = [id, item]

                conn.query(search_query_text, value)
                .then(result => {
                    if(result.rowCount == 0)
                    {
                        msg.channel.send(`${item} is not in your museum and can be donated.`);
                    }
                    else
                    {
                        msg.channel.send(`${item} is already in your museum.`);
                    }
                })
                return;
            }
        }

        msg.channel.send(`${item} is not a searchable item.`);
        return;
    }

    if(filtered_msg.includes('add'))
    {

        add = filtered_msg.split("add ");

        if(add.length <= 1) 
        {
            msg.channel.send("No match found. Either the command is misspelled or does not exist.");
            return;
        }

        item = add[1].trim();

        id = msg.author.id;

            for(var j = 0; j < data.data.donations.length; j++)
            {
                if(item.toLocaleLowerCase() == data.data.donations[j].toLocaleLowerCase())
                {
                    check_query_text = 'select * from users where id=$1 and item=$2';
                    insert_query = 'insert into users(id, item) values ($1, $2)';
                    values = [id, item];

                     conn.query(check_query_text, values)
                    .then(result => {
                        if(result.rowCount == 0)
                        {
                            conn.query(insert_query, values)
                            .then(res => {
                                    msg.channel.send(`Added ${values[1]} to the list.`);
                            })
                            .catch(e => console.error(e.stack));
                        }
                        else
                        {
                            msg.channel.send(`${values[1]} is already in the list.`);
                        }
                        
                    })
                    .catch(e => console.error(e.stack));
                    return;
                }
            }

            msg.channel.send(`${item} is not a donatable item.`)

        return;
    }

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
                msg.channel.send(`A #${arr[1]} fortune gives you a(n) ${data.data.fortunes[i].Name}.`);
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