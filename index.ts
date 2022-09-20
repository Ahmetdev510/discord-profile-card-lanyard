import express, { Express, Request, Response } from 'express';
import { join } from 'path';
import axios from 'axios';
import config from './config.json';
import link from './link.json';

const app: Express = express();
const port = process.env.SERVER_PORT || 3000;

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/public', express.static(join(__dirname, "public")));
const Discord_Employee = 1;
const Partnered_Server_Owner = 2;
const HypeSquad_Events = 4;
const Bug_Hunter_Level_1 = 8;
const House_Bravery = 64;
const House_Brilliance = 128;
const House_Balance = 256;
const Early_Supporter = 512;
const Bug_Hunter_Level_2 = 16384;
const Early_Verified_Bot_Developer = 131072;


function getBadges( flags: number ) {
    var badges = [];
    if ((flags & Discord_Employee) == Discord_Employee) {
        badges.push("discord_staff")
    }
    if ((flags & Early_Supporter) == Early_Supporter) {
        badges.push("early_supporter")
    }
    if ((flags & House_Balance) == House_Balance) {
        badges.push("hypesquad_balance")
    }
    if ((flags & House_Brilliance) == House_Brilliance) {
        badges.push("hypesquad_brilliance")
    }
    if ((flags & House_Bravery) == House_Bravery) {
        badges.push("hypesquad_bravery")
    }
    if ((flags & Bug_Hunter_Level_1) == Bug_Hunter_Level_1) {
        badges.push("bug_hunter_lv1")
    }
    if ((flags & Bug_Hunter_Level_2) == Bug_Hunter_Level_2) {
        badges.push("bug_hunter_lv2")
    }
    if ((flags & Early_Verified_Bot_Developer) == Early_Verified_Bot_Developer) {
        badges.push("verified_bot_developer")
    }
    if ((flags & HypeSquad_Events) == HypeSquad_Events) {
        badges.push("hypesquad_event")
    }
    if ((flags & Partnered_Server_Owner) == Partnered_Server_Owner) {
        badges.push("server_owner")
    }
    var htmlb = "";
    for (var i = 0; i < badges.length; i++) {
        htmlb += `<img alt=" " aria-hidden="true" src="/public/badges/${badges[i]}.svg">`
    }
    return htmlb;
}



app.get("/", async (req: Request, res: Response) => {
    try {
        var response = (await axios.get(`https://dcdn.dstn.to/profile/${config.id}`).then(res => res.data));
        var response1 = (await axios.get(`https://api.lanyard.rest/v1/users/${config.id}`).then(res => res.data));
        var html1 = [];
        var html2 = [];
        var connected_accounts = response.connected_accounts;
        for(var i = 0; i < connected_accounts.length; i++) {
            var account = connected_accounts[i];
            var link2 = JSON.parse(JSON.stringify(link));
            let type = account.type;
            if(link2[type] == undefined) continue;
            var htmltext = `<div class="platform"><img alt=" " aria-hidden="true" src="/public/platforms/${account.type}.svg"><div class="text-base platform-username">${account.name}</div>${type == "steam" || type == "youtube" || type == "spotify" ? `<a href="${link2[type] || "#"}${account.id}" rel="noreferrer noopener" target="_blank">` : `<a href="${link2[type] || "#"}${account.name}" rel="noreferrer noopener" target="_blank">`}<img alt=" " aria-hidden="true" src="/public/icons/link.svg" class="connect"></a></div>`;
            if(i%2==0) { 
                html1.push(htmltext);
            }else{
                html2.push(htmltext)
            }
        }
        res.render("index", { 
            data: response,
            data2: response1,
            badges: getBadges(response.user.public_flags), 
            config : config ,
            html1: html1.toString().split(',').join(''),
            html2: html2.toString().split(',').join('')
        });       
    } catch (error) {
        console.log(error)
        res.send("Error");
    } 
});

app.get("*", (req: Request, res: Response) => {
    res.redirect("/");
});


app.listen(port, () => {
    console.clear();
    console.log(`Server Started on ${port}!`);
});