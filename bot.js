
var discord = require('discord.js');
var fs = require('fs');
var randomColour = require('randomcolor'); // yes, the creator of this package does not speak the real english
var Config = require('./config.json');

class Bot {
    constructor(){
        this.servers = require('./servers.json');
        this.discordClient = new discord.Client();
        
        this.discordClient.on("ready", () => {
        this.client.user.setActivity('TEN RainBow Role !', { type: 'PLAYING' })    
        this.initialize();});
        
        this.discordClient.on("message", (msg) => {this.processMessage(msg)});
        
        this.discordClient.login(Config.discord_token);
    }
    
    initialize() {
        this.log("Connected to discord.");
        
        setInterval(() => {
            this.randomizeRoleColors();
        });
    }
    
    processMessage(msg) {
        if(msg.content.startsWith(">addrole")) {
            for(var role of msg.mentions.roles.array()) {
                msg.channel.send("Added " + role + " to list of rainbow roles.");
                
                this.addRainbowRole(msg.guild.id, role);
            }
        }
    }
    
    randomizeRoleColors() {
        for(var server in this.servers) {
            var liveGuild = this.discordClient.guilds.get(server);
            
            if (!liveGuild) {
                this.error("Guild with ID " + server+ " no longer exists or the bot has been removed from it.");
                continue;
            }
            
            for(var role of this.servers[server]) {
                var liveRole = liveGuild.roles.get(role);
                
                liveRole.setColor(randomColour(), "Editor By TENTEN xD");
            }
        }
    }
    
    addRainbowRole(guild, role) {
        if(this.servers[guild] == undefined) {
        }
        
        for(var existingRole of this.servers[guild]) {
            if(existingRole == role) {
                return "That role has already been added.";
            }
        }
        
        this.saveServers();
    } 
    
    saveServers() {
        fs.writeFileSync("./servers.json", JSON.stringify(this.servers), "utf8");
        this.log("Saved servers file.");
    }
    
    error(message) {
        console.log("\x1b[31mERROR\x1b[37m - \x1b[0m" + message);
    }
}

var instance = new Bot();