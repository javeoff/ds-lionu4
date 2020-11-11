const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const fs = require("fs");
prefix = "/";

client.on('ready', async () => {
 console.log(`Бот ${client.user.tag} успешно подключен!`);
 client.user.setActivity("сервер CrazyZone", { type: 'WATCHING',  });

 setInterval(()=>{
  fetch("https://en.wikipedia.org/wiki/Template:2019%E2%80%9320_coronavirus_pandemic_data")
  .then(async response => { 
   response = await response.text();
   let $ = cheerio.load(response);
   let virus = $('#thetable tr th a:contains("Ukraine")').parents('tr').find($('td')).text().split("\n");
   console.log(virus)
   let cases = virus[0];
   let deaths = virus[1];
   let recov = virus[2];
   client.channels.cache.get('705006666545889300').setName("🦠🇺🇦 Заболели: "+cases);
   client.channels.cache.get('705042176408551564').setName("💊🇺🇦 Вылеченных: "+recov);
   client.channels.cache.get('705098409555525636').setName("💀🇺🇦 Умерших: "+deaths);
  })
  .catch(error=>console.log('ошибка'+error))
 },360000)

 arr = [];
 let guild = await client.guilds.cache.first();
 let channel1 = guild.channels.cache.get('770818351433515048');
 let channel2 = guild.channels.cache.get('770818436342480928');

 setInterval(()=>{
  let count = guild.memberCount;
  let online = client.users.cache.filter(m => m.presence.status === "offline").array().length;
  
  console.log(count, online);
  channel1.setName("👥 Людей на серве: "+count);
  channel2.setName("💬 Онлайн: "+online);
 },5000)
});

role_data = {
 '👾':'573277653579071518',
 '⚡':'573275890734202882',
 '🔰':'573277297881382922',
 '🚔':'573276796326510605',
 '🍀':'573276530810290220',
 '🚀':'573277028837621844',
 '🔸':'637247244604801028'
}

client.on('messageReactionAdd',async(reaction,user)=>{
 if (reaction.message.partial) await reaction.message.fetch();
 if (reaction.partial) await reaction.fetch();

 for (let [smile, role] of Object.entries(role_data)) {
  if (reaction.emoji.name == smile) {
   role = reaction.message.guild.roles.cache.find(r => r.id === role)
   let member = reaction.message.guild.members.cache.find(member => member.id === user.id)
   await member.roles.add(role);
  }
}
})

client.on('messageReactionRemove',async(reaction,user)=>{
 if (reaction.message.partial) await reaction.message.fetch();
 if (reaction.partial) await reaction.fetch();

 for (let [smile, role] of Object.entries(role_data)) {
  if (reaction.emoji.name == smile) {
   role = reaction.message.guild.roles.cache.find(r => r.id === role)
   let member = reaction.message.guild.members.cache.find(member => member.id === user.id)
   await member.roles.remove(role);
  }
}
})

function random(min, max) {
 return Math.floor(Math.random() * (max - min) + min);
}

client.on('message', msg => {
function setCard(text,color) {
 let embed = new Discord.MessageEmbed()
 .setColor(color)
 .setDescription(text);
 msg.channel.send(embed)
}

 if (msg.author.bot) return
 data = msg.content.split(' ');
 cmd = {};
 cmd.prefix = data[0];
 cmd.start = data[0].slice(prefix.length).trim();
 cmd.args = data.slice(1);
 
 if (cmd.start == "knb") {
  replies = ["Бумага","Камень","Ножницы"]
  msg.channel.send(replies[random(0,replies.length)]);
 }

 if (cmd.start == "random") {
  let err = 0;
  cmd.args.forEach((el,i)=>{
   if (/@/.test(el)) err += 1;
  })
  cmd.args = cmd.args.filter(x => x !== "");
  if (cmd.args.length < 2 && err < 2) {
   msg.reply('Укажите участников используя @(логин)');
  }
  else if (cmd.args.length >= 2) {
   msg.channel.send('Рандом выбрал: '+cmd.args[random(0,cmd.args.length)])
  }
 }

 if (cmd.start == "roll") {
  if (cmd.args[0] && cmd.args[1]) {
   msg.reply('Случайное число - **'+random(parseInt(cmd.args[0]),parseInt(cmd.args[1]))+'**')
  }
  else msg.channel.send('Случайное число - **'+random(1,100)+'**')
 }

 if (cmd.start == 'roles') {
  setCard(`
  :exclamation:**Дорогие участники нашего канала, для получение роли вам нужно тыкнуть на смайлик желаемой роли под этим сообщением**\n

  :space_invader: - Роль "Геймер" дает доступ ко всем игровым войсам а так-же к "Чебуречной"\n 
  :no_entry:Все остальные роли дают доступ к войсам соответствующей игре\n
  :zap: - Роль "CSGO"\n
  :beginner: - Роль "Пабгер" \n
  :oncoming_police_car: - Роль "GtaV" \n
  :four_leaf_clover: - Роль "Дотер" \n
  :rocket:- Роль "SAMP" \n
  :small_orange_diamond:- Роль "Roblox"\n
  `,'#FFFFFF')
 }
});

client.login('NzA0ODIzNjQ2Mjc0NzE1NzA5.XqiwmQ.BVA-VlWaG280vKz-mFR43TPBLVs');