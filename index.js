"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const axios_1 = __importDefault(require("axios"));
const config_json_1 = __importDefault(require("./config.json"));
const link_json_1 = __importDefault(require("./link.json"));
const app = (0, express_1.default)();
const port = process.env.SERVER_PORT || 3000;
app.set('views', (0, path_1.join)(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/public', express_1.default.static((0, path_1.join)(__dirname, "public")));
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
function getBadges(flags) {
    var badges = [];
    if ((flags & Discord_Employee) == Discord_Employee) {
        badges.push("discord_staff");
    }
    if ((flags & Early_Supporter) == Early_Supporter) {
        badges.push("early_supporter");
    }
    if ((flags & House_Balance) == House_Balance) {
        badges.push("hypesquad_balance");
    }
    if ((flags & House_Brilliance) == House_Brilliance) {
        badges.push("hypesquad_brilliance");
    }
    if ((flags & House_Bravery) == House_Bravery) {
        badges.push("hypesquad_bravery");
    }
    if ((flags & Bug_Hunter_Level_1) == Bug_Hunter_Level_1) {
        badges.push("bug_hunter_lv1");
    }
    if ((flags & Bug_Hunter_Level_2) == Bug_Hunter_Level_2) {
        badges.push("bug_hunter_lv2");
    }
    if ((flags & Early_Verified_Bot_Developer) == Early_Verified_Bot_Developer) {
        badges.push("verified_bot_developer");
    }
    if ((flags & HypeSquad_Events) == HypeSquad_Events) {
        badges.push("hypesquad_event");
    }
    if ((flags & Partnered_Server_Owner) == Partnered_Server_Owner) {
        badges.push("server_owner");
    }
    var htmlb = "";
    for (var i = 0; i < badges.length; i++) {
        htmlb += `<img alt=" " aria-hidden="true" src="/public/badges/${badges[i]}.svg">`;
    }
    return htmlb;
}
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var response = (yield axios_1.default.get(`https://dcdn.dstn.to/profile/${config_json_1.default.id}`).then(res => res.data));
        var response1 = (yield axios_1.default.get(`https://api.lanyard.rest/v1/users/${config_json_1.default.id}`).then(res => res.data));
        var html1 = [];
        var html2 = [];
        var connected_accounts = response.connected_accounts;
        for (var i = 0; i < connected_accounts.length; i++) {
            var account = connected_accounts[i];
            var link2 = JSON.parse(JSON.stringify(link_json_1.default));
            let type = account.type;
            if (link2[type] == undefined)
                continue;
            var htmltext = `<div class="platform"><img alt=" " aria-hidden="true" src="/public/platforms/${account.type}.svg"><div class="text-base platform-username">${account.name}</div>${type == "steam" || type == "youtube" || type == "spotify" ? `<a href="${link2[type] || "#"}${account.id}" rel="noreferrer noopener" target="_blank">` : `<a href="${link2[type] || "#"}${account.name}" rel="noreferrer noopener" target="_blank">`}<img alt=" " aria-hidden="true" src="/public/icons/link.svg" class="connect"></a></div>`;
            if (i % 2 == 0) {
                html1.push(htmltext);
            }
            else {
                html2.push(htmltext);
            }
        }
        res.render("index", {
            data: response,
            data2: response1,
            badges: getBadges(response.user.public_flags),
            config: config_json_1.default,
            html1: html1.toString().split(',').join(''),
            html2: html2.toString().split(',').join('')
        });
    }
    catch (error) {
        console.log(error);
        res.send("Error");
    }
}));
app.get("*", (req, res) => {
    res.redirect("/");
});
app.listen(port, () => {
    console.clear();
    console.log(`Server Started on ${port}!`);
});
