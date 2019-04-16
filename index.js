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

    if(filtered_msg.includes('commands'))
    {
        commands = filtered_msg.split(' ');

        if(commands.length > 1) 
        {
            msg.channel.send("No match found. Either the command is misspelled or does not exist.");
            return;
        }

        commands = filtered_msg[1].trim();

        msg.channel.send("The list of commands are **!search, !add, !help, !buy, !sell, !fortune, !item, !art, !remove, !list.** \nUse **!help <command name>** to find out how to use the command.");

        return;
    }

    if(filtered_msg.includes('help'))
    {
        help_arr = filtered_msg.split(" ");
        comm = ['add', 'buy', 'sell', 'fortune', 'search', 'item', 'art', 'remove', 'list'];

        if(help_arr.length <= 1) 
        {
            msg.channel.send("No match found. Either the command is misspelled or does not exist.");
            return;
        }

        help = help_arr[1].trim();

        for(var q = 0; q < comm.length; q++)
        {
            if(help.toLocaleLowerCase() ==  comm[q])
            {
                switch(help)
                {
                    case 'add':
                        msg.channel.send("The add command is used to add items to your museum list. \n The format is **!add <item name>** \nHere is an example below:\n **!add dace**");
                        break;
                    case 'buy':
                        msg.channel.send("The buy command is used to determine how many turnips you can buy with X amount of bells from Joan. \n The format is **!buy set price <price_of_turnips_from_joan> set bells <your_amount_of_bells>** (NO COMMAS IN NUMBERS) \n Here is an example below: \n **!buy set price 95 set bells 100000** ");
                        break;
                    case 'sell':
                        msg.channel.send("The sell command is used to determine how much bells you make selling turnips to reese. \n The format is **!sell set price <price_of_turnip_from_reese> set turnips <amount_of_turnips_you_have>** (NO COMMAS IN NUMBERS) \n Here is an example below: \n **!sell set price 300 set turnips 4000**");
                        break;
                    case 'fortune':
                        msg.channel.send("The fortune command is used to find out which prizes certain fortune numbers give. \n The format is **!fortune <fortune_number>** \n Here is an example below: \n **!fortune 35**");
                        break;
                    case 'search':
                        msg.channel.send("The search command is used to check your museum list to see if the item is donated or not. \n The format is **!search <name_of_item>** \n Here is an example below: \n **!search amber**");
                        break;
                    case 'item':
                        msg.channel.send("The item command is used to find out how much an item sells for. \n The format is **!item <item name>** \n Here is an example below: \n **!item golden stag**");
                        break;
                    case 'art':
                        msg.channel.send("The art command is used to check if an art piece is real or fake. \n The format is **!art <art name>** \n Here is an example below: \n **!art graceful painting**");
                        break;
                    case 'remove':
                        msg.channel.send("The remove command is used to remove an item from your list. \n The format is **!remove <item_name>** \n Here is an example below: \n **!remove dace**");
                        break;
                    case 'list':
                        msg.channel.send("The list command is used to check the entire list you have added. There are 4 list names (fish, fossil, art, and bug). \n The format is **!list <list_name>** \n Here is an example below: \n **!list bug**");
                        break;
                }
                return;
            }
        }

        msg.channel.send(`${help} is not on the list of commands.`);
        return;

    }

    if(filtered_msg.includes('list'))
    {
        l = filtered_msg.split("list ");

        if(l.length <= 1)
        {
            msg.channel.send("No match found. Either the command is misspelled or does not exist.");
            return;
        }

        mod_list = l[1].trim();
        id = msg.author.id;

        if(mod_list == "fish")
        {
            arr = [];
            fish_arr = [];
            final_arr = [];
            text = "";
            query_text = "select item from users where id=$1";
            value = [id];
            conn.query(query_text, value)
            .then(res => {
                for(var v = 0; v < res.rowCount; v++)
                {
                    arr.push(res.rows[v].item);
                }

                msg.channel.send("**FISH\n**");

                outerloop:
                for(var g = 0; g <= data.data.donations.indexOf("Giant Isopod"); g++)
                {
                    innerloop:
                    for(var f = 0; f < arr.length; f++)
                    {
                        if(arr[f].toLocaleLowerCase() == data.data.donations[g].toLocaleLowerCase())
                        {
                            text = "~~" + data.data.donations[g].toLocaleLowerCase() + "~~"; 
                            final_arr.push(text);
                            continue outerloop;
                        }
                    }

                    final_arr.push(data.data.donations[g].toLocaleLowerCase());
                }

                for(var i = 0; i <= final_arr.length; i+=3)
                {
                    if(i+2 < final_arr.length - 1)
                    {
                        msg.channel.send(final_arr[i] + "  |  " + final_arr[i+1] + "  |  " + final_arr[i+2] + "\n");
                    }
                    else if(i+1 < final_arr.length - 1)
                    {
                        msg.channel.send(final_arr[i] + "  |  " + final_arr[i+1] + "\n");
                    }
                    else
                    {
                        msg.channel.send(final_arr[final_arr.length - 1]);
                    }
                }
            })
            return;
        }
        else if(mod_list == "bug")
        {
            arr = [];
            fish_arr = [];
            final_arr = [];
            text = "";
            query_text = "select item from users where id=$1";
            value = [id];
            conn.query(query_text, value)
            .then(res => {
                for(var v = 0; v < res.rowCount; v++)
                {
                    arr.push(res.rows[v].item);
                }

                msg.channel.send("**BUG\n**");

                outerloop:
                for(var g = data.data.donations.indexOf("Giant Isopod") + 1; g <= data.data.donations.indexOf("Scorpion"); g++)
                {
                    innerloop:
                    for(var f = 0; f < arr.length; f++)
                    {
                        if(arr[f].toLocaleLowerCase() == data.data.donations[g].toLocaleLowerCase())
                        {
                            text = "~~" + data.data.donations[g].toLocaleLowerCase() + "~~"; 
                            final_arr.push(text);
                            continue outerloop;
                        }
                    }

                    final_arr.push(data.data.donations[g].toLocaleLowerCase());
                }

                for(var i = 0; i <= final_arr.length; i+=3)
                {
                    if(i+2 < final_arr.length - 1)
                    {
                        msg.channel.send(final_arr[i] + "  |  " + final_arr[i+1] + "  |  " + final_arr[i+2] + "\n");
                    }
                    else if(i+1 < final_arr.length - 1)
                    {
                        msg.channel.send(final_arr[i] + "  |  " + final_arr[i+1] + "\n");
                    }
                    else
                    {
                        msg.channel.send(final_arr[final_arr.length - 1]);
                    }
                }
            })
            return;
        }
        else if(mod_list == "fossil")
        {
            arr = [];
            fish_arr = [];
            final_arr = [];
            text = "";
            query_text = "select item from users where id=$1";
            value = [id];
            conn.query(query_text, value)
            .then(res => {
                for(var v = 0; v < res.rowCount; v++)
                {
                    arr.push(res.rows[v].item);
                }

                msg.channel.send("**FOSSIL\n**");

                outerloop:
                for(var g = data.data.donations.indexOf("Scorpion") + 1; g <= data.data.donations.indexOf("Velociraptor Torso"); g++)
                {
                    innerloop:
                    for(var f = 0; f < arr.length; f++)
                    {
                        if(arr[f].toLocaleLowerCase() == data.data.donations[g].toLocaleLowerCase())
                        {
                            text = "~~" + data.data.donations[g].toLocaleLowerCase() + "~~"; 
                            final_arr.push(text);
                            continue outerloop;
                        }
                    }

                    final_arr.push(data.data.donations[g].toLocaleLowerCase());
                }

                for(var i = 0; i <= final_arr.length; i+=3)
                {
                    if(i+2 < final_arr.length - 1)
                    {
                        msg.channel.send(final_arr[i] + "  |  " + final_arr[i+1] + "  |  " + final_arr[i+2] + "\n");
                    }
                    else if(i+1 < final_arr.length - 1)
                    {
                        msg.channel.send(final_arr[i] + "  |  " + final_arr[i+1] + "\n");
                    }
                    else
                    {
                        msg.channel.send(final_arr[final_arr.length - 1]);
                    }
                }
            })
            return;
        }
        else if(mod_list == "art")
        {
            arr = [];
            fish_arr = [];
            final_arr = [];
            text = "";
            query_text = "select item from users where id=$1";
            value = [id];
            conn.query(query_text, value)
            .then(res => {
                for(var v = 0; v < res.rowCount; v++)
                {
                    arr.push(res.rows[v].item);
                }

                msg.channel.send("**ART\n**");

                outerloop:
                for(var g = data.data.donations.indexOf("Velociraptor Torso") + 1; g <= data.data.donations.indexOf("Worthy Painting"); g++)
                {
                    innerloop:
                    for(var f = 0; f < arr.length; f++)
                    {
                        if(arr[f].toLocaleLowerCase() == data.data.donations[g].toLocaleLowerCase())
                        {
                            text = "~~" + data.data.donations[g].toLocaleLowerCase() + "~~"; 
                            final_arr.push(text);
                            continue outerloop;
                        }
                    }

                    final_arr.push(data.data.donations[g].toLocaleLowerCase());
                }

                for(var i = 0; i <= final_arr.length; i+=3)
                {
                    if(i+2 < final_arr.length - 1)
                    {
                        msg.channel.send(final_arr[i] + "  |  " + final_arr[i+1] + "  |  " + final_arr[i+2] + "\n");
                    }
                    else if(i+1 < final_arr.length - 1)
                    {
                        msg.channel.send(final_arr[i] + "  |  " + final_arr[i+1] + "\n");
                    }
                    else
                    {
                        msg.channel.send(final_arr[final_arr.length - 1]);
                    }
                }
            })
            return;
        }
    }

    if(filtered_msg.includes('remove'))
    {
        remove = filtered_msg.split("remove ");

        if(remove.length <= 1)
        {
            msg.channel.send("No match found. Either the command is misspelled or does not exist.");
            return;
        }

        rem = remove[1].trim();

        switch(rem.toLocaleLowerCase()) {
            case 't.rex skull':
                rem = 'Tyrannosaurus Rex Skull';
                break;
            case 't.rex torso':
                rem = 'Tyrannosaurus Rex Torso';
                break;
            case 't.rex tail':
                rem = 'Tyrannosaurus Rex Tail';
                break;
            case 'tricera skull':
                rem = 'Triceratops Skull';
                break;
            case 'tricera torso':
                rem = 'Triceratops Torso';
                break;
            case 'tricera tail':
                rem = 'Triceratops Tail';
                break;
            case 'ankylo skull':
                rem = 'Anykylosaurus Skull';
                break;
            case 'ankylo torso':
                rem = 'Anykylosaurus Torso';
                break;
            case 'ankylo tail':
                rem = 'Anykylosaurus Tail';
                break;
            case 'apato skull':
                rem = 'Apatosaurus Skull';
                break;
            case 'apato torso':
                rem = 'Apatosaurus Torso';
                break;
            case 'sabertooth skull':
                rem = 'Sabretooth Tiger Skull';
                break;
            case 'sabertooth torso':
                rem = 'Sabretooth Tiger Torso';
                break;
            case 'pachy skull':
                rem = 'Pachysaurus Skull';
                break;
            case 'pachy torso':
                rem = 'Pachysaurus Torso';
                break;
            case 'pachy tail':
                rem = 'Pachysaurus Tail';
                break;
            case 'parasaur skull':
                rem = 'Parasaurus Skull';
                break;
            case 'parasaur torso':
                rem = 'Parasaurus Torso';
                break;
            case 'parasaur tail':
                rem = 'Parasaurus Tail';
                break;
            case 'diplo skull':
                rem = 'Diplodocus Skull';
                break;
            case 'diplo neck':
                rem = 'Diplodocus Neck';
                break;
            case 'diplo chest':
                rem = 'Diplodocus Chest';
                break;
            case 'diplo hip':
                rem = 'Diplodocus Hip';
                break;
            case 'diplo tail':
                rem = 'Diplodocus Tail';
                break;
            case 'plesio skull':
                rem = 'Pleiosaur Skull';
                break;
            case 'plesio torso':
                rem = 'Pleiosaur Torso';
                break;
            case 'plesio tail':
                rem = 'Pleiosaur Tail';
                break;
            case 'stego skull':
                rem = 'Stegosaurus Skull';
                break;
            case 'stego torso':
                rem = 'Stegosaurus Torso';
                break;
            case 'stego tail':
                rem = 'Stegosaurus Tail';
                break;
            case 'ptera left wing':
                rem = 'Pteranodon Left Wing';
                break;
            case 'ptera right wing':
                rem = 'Pteranodon Right Wing';
                break;
            case 'ptera skull':
                rem = 'Pteranodon Skull';
                break;
            case 'ichthyo skull':
                rem = 'Ichthyosaur Skull';
                break;
            case 'ichthyo torso':
                rem = 'Ichthyosaur Torso';
                break;
            case 'raptor skull':
                rem = 'Velociraptor Skull';
                break;
            case 'raptor torso':
                rem = 'Velociraptor Torso';
                break;
            case 'styraco skull':
                rem = 'Styracosaurus Skull';
                break;
            case 'styraco torso':
                rem = 'Styracosaurus Torso';
                break;
            case 'styraco tail':
                rem = 'Styracosaurus Tail';
                break;
            case 'spino skull':
                rem = 'Spinosaurus Skull';
                break;
            case 'spino torso':
                rem = 'Spinosaurus Torso';
                break;
            case 'spino tail':
                rem = 'Spinosaurus Tail';
                break;
            case 'megacero skull':
                rem = 'Megaceros Skull';
                break;
            case 'megacero torso':
                rem = 'Megaceros Torso';
                break;
            case 'megacero tail':
                rem = 'Megaceros Tail';
                break;
        }

        id = msg.author.id;
        mod = rem.toLocaleLowerCase();

        for(var k = 0; k < data.data.donations.length; k++)
        {
            if(mod.toLocaleLowerCase() == data.data.donations[k].toLocaleLowerCase())
            {
                search_query_text = "select * from users where id=$1 and item=$2";
                remove_query_text = "delete from users where id=$1 and item=$2";
                value = [id, mod];

                conn.query(search_query_text, value)
                .then(result => {
                    if(result.rowCount == 0)
                    {
                        msg.channel.send(`**${mod}** is not in your list.`);
                    }
                    else
                    {
                        conn.query(remove_query_text, value)
                        .then(r  => msg.channel.send(`**${mod}** was removed.`))
                    }
                })
                return;
            }
        }

        msg.channel.send(`**${mod}** is not a(n) removable item.`);
        return;
    }

    if(filtered_msg.includes('search'))
    {
        search = filtered_msg.split("search ");

        if(search.length <= 1) 
        {
            msg.channel.send("No match found. Either the command is misspelled or does not exist.");
            return;
        }

        item = search[1].trim();

        switch(item.toLocaleLowerCase()) {
            case 't.rex skull':
                item = 'Tyrannosaurus Rex Skull';
                break;
            case 't.rex torso':
                item = 'Tyrannosaurus Rex Torso';
                break;
            case 't.rex tail':
                item = 'Tyrannosaurus Rex Tail';
                break;
            case 'tricera skull':
                item = 'Triceratops Skull';
                break;
            case 'tricera torso':
                item = 'Triceratops Torso';
                break;
            case 'tricera tail':
                item = 'Triceratops Tail';
                break;
            case 'ankylo skull':
                item = 'Anykylosaurus Skull';
                break;
            case 'ankylo torso':
                item = 'Anykylosaurus Torso';
                break;
            case 'ankylo tail':
                item = 'Anykylosaurus Tail';
                break;
            case 'apato skull':
                item = 'Apatosaurus Skull';
                break;
            case 'apato torso':
                item = 'Apatosaurus Torso';
                break;
            case 'sabertooth skull':
                item = 'Sabretooth Tiger Skull';
                break;
            case 'sabertooth torso':
                item = 'Sabretooth Tiger Torso';
                break;
            case 'pachy skull':
                item = 'Pachysaurus Skull';
                break;
            case 'pachy torso':
                item = 'Pachysaurus Torso';
                break;
            case 'pachy tail':
                item = 'Pachysaurus Tail';
                break;
            case 'parasaur skull':
                item = 'Parasaurus Skull';
                break;
            case 'parasaur torso':
                item = 'Parasaurus Torso';
                break;
            case 'parasaur tail':
                item = 'Parasaurus Tail';
                break;
            case 'diplo skull':
                item = 'Diplodocus Skull';
                break;
            case 'diplo neck':
                item = 'Diplodocus Neck';
                break;
            case 'diplo chest':
                item = 'Diplodocus Chest';
                break;
            case 'diplo hip':
                item = 'Diplodocus Hip';
                break;
            case 'diplo tail':
                item = 'Diplodocus Tail';
                break;
            case 'plesio skull':
                item = 'Pleiosaur Skull';
                break;
            case 'plesio torso':
                item = 'Pleiosaur Torso';
                break;
            case 'plesio tail':
                item = 'Pleiosaur Tail';
                break;
            case 'stego skull':
                item = 'Stegosaurus Skull';
                break;
            case 'stego torso':
                item = 'Stegosaurus Torso';
                break;
            case 'stego tail':
                item = 'Stegosaurus Tail';
                break;
            case 'ptera left wing':
                item = 'Pteranodon Left Wing';
                break;
            case 'ptera right wing':
                item = 'Pteranodon Right Wing';
                break;
            case 'ptera skull':
                item = 'Pteranodon Skull';
                break;
            case 'ichthyo skull':
                item = 'Ichthyosaur Skull';
                break;
            case 'ichthyo torso':
                item = 'Ichthyosaur Torso';
                break;
            case 'raptor skull':
                item = 'Velociraptor Skull';
                break;
            case 'raptor torso':
                item = 'Velociraptor Torso';
                break;
            case 'styraco skull':
                item = 'Styracosaurus Skull';
                break;
            case 'styraco torso':
                item = 'Styracosaurus Torso';
                break;
            case 'styraco tail':
                item = 'Styracosaurus Tail';
                break;
            case 'spino skull':
                item = 'Spinosaurus Skull';
                break;
            case 'spino torso':
                item = 'Spinosaurus Torso';
                break;
            case 'spino tail':
                item = 'Spinosaurus Tail';
                break;
            case 'megacero skull':
                item = 'Megaceros Skull';
                break;
            case 'megacero torso':
                item = 'Megaceros Torso';
                break;
            case 'megacero tail':
                item = 'Megaceros Tail';
                break;
        }

        id = msg.author.id;
        mod = item.toLocaleLowerCase();

        for(var k = 0; k < data.data.donations.length; k++)
        {
            if(mod.toLocaleLowerCase() == data.data.donations[k].toLocaleLowerCase())
            {
                search_query_text = "select * from users where id=$1 and item=$2"
                value = [id, mod]

                conn.query(search_query_text, value)
                .then(result => {
                    if(result.rowCount == 0)
                    {
                        msg.channel.send(`**${mod}** is not in your museum and can be donated.`);
                    }
                    else
                    {
                        msg.channel.send(`**${mod}** is already in your museum.`);
                    }
                })
                return;
            }
        }

        msg.channel.send(`**${mod}** is not a searchable item.`);
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

        switch(item.toLocaleLowerCase()) {
            case 't.rex skull':
                item = 'Tyrannosaurus Rex Skull';
                break;
            case 't.rex torso':
                item = 'Tyrannosaurus Rex Torso';
                break;
            case 't.rex tail':
                item = 'Tyrannosaurus Rex Tail';
                break;
            case 'tricera skull':
                item = 'Triceratops Skull';
                break;
            case 'tricera torso':
                item = 'Triceratops Torso';
                break;
            case 'tricera tail':
                item = 'Triceratops Tail';
                break;
            case 'ankylo skull':
                item = 'Anykylosaurus Skull';
                break;
            case 'ankylo torso':
                item = 'Anykylosaurus Torso';
                break;
            case 'ankylo tail':
                item = 'Anykylosaurus Tail';
                break;
            case 'apato skull':
                item = 'Apatosaurus Skull';
                break;
            case 'apato torso':
                item = 'Apatosaurus Torso';
                break;
            case 'apato tail':
                item = 'Apatosaurus Tail';
                break;
            case 'sabertooth skull':
                item = 'Sabretooth Tiger Skull';
                break;
            case 'sabertooth torso':
                item = 'Sabretooth Tiger Torso';
                break;
            case 'pachy skull':
                item = 'Pachysaurus Skull';
                break;
            case 'pachy torso':
                item = 'Pachysaurus Torso';
                break;
            case 'pachy tail':
                item = 'Pachysaurus Tail';
                break;
            case 'parasaur skull':
                item = 'Parasaurus Skull';
                break;
            case 'parasaur torso':
                item = 'Parasaurus Torso';
                break;
            case 'parasaur tail':
                item = 'Parasaurus Tail';
                break;
            case 'diplo skull':
                item = 'Diplodocus Skull';
                break;
            case 'diplo neck':
                item = 'Diplodocus Neck';
                break;
            case 'diplo chest':
                item = 'Diplodocus Chest';
                break;
            case 'diplo hip':
                item = 'Diplodocus Hip';
                break;
            case 'diplo tail':
                item = 'Diplodocus Tail';
                break;
            case 'plesio skull':
                item = 'Pleiosaur Skull';
                break;
            case 'plesio torso':
                item = 'Pleiosaur Torso';
                break;
            case 'plesio neck':
                item = 'Pleiosaur Neck';
                break;
            case 'stego skull':
                item = 'Stegosaurus Skull';
                break;
            case 'stego torso':
                item = 'Stegosaurus Torso';
                break;
            case 'stego tail':
                item = 'Stegosaurus Tail';
                break;
            case 'ptera left wing':
                item = 'Pteranodon Left Wing';
                break;
            case 'ptera right wing':
                item = 'Pteranodon Right Wing';
                break;
            case 'ptera skull':
                item = 'Pteranodon Skull';
                break;
            case 'ichthyo skull':
                item = 'Ichthyosaur Skull';
                break;
            case 'ichthyo torso':
                item = 'Ichthyosaur Torso';
                break;
            case 'raptor skull':
                item = 'Velociraptor Skull';
                break;
            case 'raptor torso':
                item = 'Velociraptor Torso';
                break;
            case 'styraco skull':
                item = 'Styracosaurus Skull';
                break;
            case 'styraco torso':
                item = 'Styracosaurus Torso';
                break;
            case 'styraco tail':
                item = 'Styracosaurus Tail';
                break;
            case 'spino skull':
                item = 'Spinosaurus Skull';
                break;
            case 'spino torso':
                item = 'Spinosaurus Torso';
                break;
            case 'spino tail':
                item = 'Spinosaurus Tail';
                break;
            case 'megacero skull':
                item = 'Megaceros Skull';
                break;
            case 'megacero torso':
                item = 'Megaceros Torso';
                break;
            case 'megacero tail':
                item = 'Megaceros Tail';
                break;
        }

        id = msg.author.id;
        mod = item.toLocaleLowerCase();

            for(var j = 0; j < data.data.donations.length; j++)
            {
                if(mod.toLocaleLowerCase() == data.data.donations[j].toLocaleLowerCase())
                {
                    check_query_text = 'select * from users where id=$1 and item=$2';
                    insert_query = 'insert into users(id, item) values ($1, $2)';
                    values = [id, mod];

                     conn.query(check_query_text, values)
                    .then(result => {
                        if(result.rowCount == 0)
                        {
                            conn.query(insert_query, values)
                            .then(res => {
                                    msg.channel.send(`Added **${values[1]}** to the list.`);
                            })
                            .catch(e => console.error(e.stack));
                        }
                        else
                        {
                            msg.channel.send(`**${values[1]}** is already in the list.`);
                        }
                        
                    })
                    .catch(e => console.error(e.stack));
                    return;
                }
            }

            msg.channel.send(`**${mod}** is not a donatable item.`)

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
            msg.channel.send("Bad number format. Please write the numbers like the following example: **!buy set price 100 set bells 100**")
            return;
        }

        msg.channel.send(`You can buy **${Math.floor(result)}** turnip(s).`)

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
            msg.channel.send("Bad number format. Please write the numbers like the following example: **!sell set price 100 set bells 100**")
            return;
        }

        msg.channel.send(`**${array[6]}** turnips for **${array[3]}** bells each, sells for **${Math.floor(result)}** bells.`)

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
                msg.channel.send(`A **#${arr[1]}** fortune gives you a(n) **${data.data.fortunes[i].Name}**.`);
                return;
            }
        }
    }

    if(filtered_msg.includes('art'))
    {
        art = filtered_msg.split("art ");

        if(art.length <= 1) 
        {
            msg.channel.send("No match found. Either the command is misspelled or does not exist.");
            return;
        }

        art = art[1].trim();

        for(var i = 0; i < data.data.arts.length; i++)
        {
            if(data.data.arts[i].Name.toLocaleLowerCase() === art)
            {
                let embed = new Discord.RichEmbed();
                
                embed.setTitle(data.data.arts[i].Name);
                embed.setImage(data.data.arts[i].src);
                embed.setDescription(data.data.arts[i].Description);
                msg.channel.send(embed);
                return;
            }
        }
    }

    if(filtered_msg.includes('item'))
    {
        a = filtered_msg.split("item ");

        if(a.length <= 1) 
        {
            msg.channel.send("No match found. Either the command is misspelled or does not exist.");
            return;
        }

        m = a[1].trim();

        console.log(m);

        for(var i = 0; i < data.data.bugs.length; i++)
        {
            if(data.data.bugs[i].Name.toLocaleLowerCase() === m)
            {
                msg.channel.send(`The price for **${data.data.bugs[i].Name}** is **${data.data.bugs[i].Price}** bells`);
                return;
            }
        }

        for(var i = 0; i < data.data.fish.length; i++)
        {
            if(data.data.fish[i].Name.toLocaleLowerCase() === m)
            {
                msg.channel.send(`The price for **${data.data.fish[i].Name}** is **${data.data.fish[i].Price}** bells`);
                return;
            }
        }

        for(var i = 0; i < data.data.fossils.length; i++)
        {
            if(data.data.fossils[i].Name.toLocaleLowerCase() === m)
            {
                msg.channel.send(`The price for **${data.data.fossils[i].Name}** is **${data.data.fossils[i].Price}** bells`);
                return;
            }
        }

    }

    msg.channel.send("No match found. Either the command is misspelled or does not exist.");
});

client.on('ready', () => {
    console.log("Bot is now connected.")
});
client.login(process.env.api_key);