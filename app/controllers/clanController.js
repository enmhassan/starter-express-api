const Clan = require("../models/clan")
const User = require("../models/user")

async function clan(req, res) {
    try {
        const { user_id, clan_name } = req.body;
        if (!clan_name) {
            res.status(400).send("Clan name is required");
        }
        const oldClanName = await Clan.findOne({clan_name});
        
        if (oldClanName) {
            return res.status(400).send("Clan name already exists");
        }

        const clan = await Clan.create({
            clan_name
        }).then ( ()=> {
            const newClan = Clan.findOne({clan_name});
            const user = User.findOne({user_id});
            user.clan = newClan._id
        })
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    clan
};