const mongoose = require("mongoose");

const clanSchema = new mongoose.Schema({
    clan_name: { type: String, default: null },
    clan_level: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    iron: { type: Number, default: 0 },
    wood: { type: Number, default: 0 },
});

const Clan = mogoose.model('Clan', clanSchema)
module.exports = Clan;