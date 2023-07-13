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
        })
        const user = await User.findOne({user_id});
        user.clan = clan._id;
        await user.save();
        res.status(200).send("Clan created successfully")
    } catch(err) {
        console.log(err);
    }
}

module.exports = {
    clan
};