const Path = require("path");

const knex = require("knex")({
    client: "pg",
    connection: {
        host: "faraday.cse.taylor.edu",
        database: "asher_gingerich",
        user: "asher_gingerich",
        password: "difatexu"
    }
});

const objection = require('objection');
const Model = objection.Model;
Model.knex(knex);

const Joi = require("joi");
const Hapi = require('hapi');

class Members extends Model {
    static get tableName() {
        return "members";
    }
    static get relationMappings() {
        return {
            teams: {
                relation: Model.ManyToManyRelation,
                modelClass: Teams,
                join: {
                    from: "members.membersid",
                    through: {
                        from: "memberteam.membersid",
                        to: "memberteam.teamsid"
                    },
                    to: "teams.teamsid"
                }
            }
        };
    }
}

class Commitments extends Model {
    static get tableName() {
        return "commitments";
    }
}


class Teams extends Model {
    static get tableName() {
        return "teams";
    }
    static get relationMappings() {
        return {
            activities: {
                relation: Model.HasManyRelation,
                modelClass: Activities,
                join: {
                    from: "teams.teamsid",
                    to: "activities.teamsid"
                }
            }
        };
    }
}

class Activities extends Model {
    static get tableName() {
        return "activities";
    }
    static get relationMappings() {
        return {
            team: {
                relation: Model.BelongsToOneRelation,
                modelClass: Teams,
                join: {
                    from: "activities.teamsid",
                    to: "teams.teamsid"
                }
            },
            timeslots: {
                relation: Model.HasManyRelation,
                modelClass: TimeSlots,
                join: {
                    from: "activities.activityid",
                    to: "timeslot.activityid"
                }
            }
        };
    }
}

class TimeSlots extends Model {
    static get tableName() {
        return "timeslot";
    }
}

const server = Hapi.server({
    host: "localhost",
    port: 3000,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, "dist")
        }
    }
    
});

function memberIDValidate() {
    return Joi.number().integer().description("Unique member ID for member.");
}

function teamIDValidate() {
    return Joi.string().description("Unique Team ID");
}


async function init() {
    await server.register([require('vision'), require('inert'), require('lout'), require("blipp")]);
    await server.register({
        plugin: require("hapi-pino"),
        option: {
            prettyPrint: true
        }
    });
    server.route([
        {
            method: "GET",
            path: "/{param*}",
            config: {
                description: "Production Application.",
            },
            handler: {
                directory: {
                    path: ".",
                    redirectToSlash: true,
                    index: true
                }
            }
        },
        {
            method: "POST",
            path:"/api/",
            config: {
                description: "Post a new login session",
                validate: {
                    payload: {
                        email: Joi.string().email().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request, h) => {
                query = await Members.query()
                    .select("membersid")
                    .where("email_address", request.payload.email)
                    .where("password", request.payload.password);
                if(query[0]) {
                    return {
                        ok: true,
                        data: query[0]
                    }
                }
                else {
                    return {
                        ok: false
                    };
                }
            }
        },
        {
            method: "GET",
            path: "/api/{memberID}/activities",
            config: {
                description: "Get and display activites",
                validate: {
                    params: {
                        memberID: memberIDValidate()
                    }
                }
            },
            handler: async (request, h) =>{
                let member = await Members.query()
                    .where("membersid", request.params.memberID)
                    .first()
                    .eager("teams.activities.timeslots")
                    .catch(error => console.log(error.message));
                let activities = [];
                member.teams.forEach(team => {
                    activities = activities.concat(team.activities);
                });
                return activities;
            }
        },
        {
            method: "POST",
            path: "/api/{teamID}/activities",
            config: {
                description: "Post a new activity.",
                validate: {
                    params: {
                        teamID: teamIDValidate()
                    },
                    payload: {
                        activityName: Joi.string().required(),
                        loc: Joi.string().required(),
                        startTime: Joi.date().required(),
                        endTime: Joi.date().required(),
                    }
                }
            },
            handler: async (request, h) =>{
                let current = await Activities.query().count('activityid');
                let active = await Activities.query().returning('activityid').insert({
                    activityid: current[0].count + 1,
                    teamsid: request.params.teamID,
                    location: request.payload.loc,
                    activityname: request.payload.activityName
                });
                current = await TimeSlots.query().count('timeslotid');
                await TimeSlots.query().returning('timeslotid').insert({
                    timeslotid: current[0].count + 1,
                    activityid: active.activityid,
                    starttime: request.payload.startTime,
                    endtime: request.payload.endTime
                });
                return {
                    ok: true
                }
            }
        },
        {
            method: "GET",
            path: "/api/teams/{memberID}",
            config: {
                description: "Retrieve all teams member is enrolled in.",
                validate: {
                    params: {
                        memberID: memberIDValidate()
                    }
                }
            },
            handler: async (request, h) =>{
                let member = await Members.query()
                    .where("membersid", request.params.memberID)
                    .first()
                    .eager("teams")
                    .catch(error => console.log(error.message));
                let teamnames = [];
                member.teams.forEach(team => {
                    console.log(team.teamname);
                    teamnames = teamnames.concat(team.teamname);
                });
                return teamnames;
            }
        },
        {
            method: "GET",
            path: "/api/{memberID}/commitments",
            config: {
                description: "Retrieve all commitments for a member.",
                validate: {
                    params: {
                        memberID: memberIDValidate()
                    }
                }
            },
            handler: async (request, h) =>{
                let commitment = await Commitments.query()
                    .where("membersid", request.params.memberID)
                    .catch(error => console.log(error.message));
                return commitment;
            }
        },
        {
            method: "POST",
            path: "/api/teams",
            config: {
                description: "Create new team",
                validate: {
                    payload: {
                        teamName: Joi.string().required().description("Name of team.")
                    }
                }
            },
            handler: async (request, h) =>{
            }
        },
        {
            method: "POST",
            path: "/api/teams/{teamID}/{memberID}",
            config: {
                description: "Add a member to a team.",
                validate: {
                    params: {
                        teamID: teamIDValidate(),
                        memberID: memberIDValidate()
                    }
                }
            },
            handler: async (request, h) =>{
            }
        },
        {
            method: "DELETE",
            path: "/api/teams/{teamID}/",
            config: {
                description: "Remove a member from a team.",
                validate: {
                    params: {
                        teamID: teamIDValidate(),
                    },
                    payload: {
                        memberID: memberIDValidate()
                    }
                }
            },
            handler: async (request, h) =>{
            }
        },
        {
            method: "PATCH",
            path: "/api/{memberID}",
            config: {
                description: "Update member core hours.",
                validate: {
                    params: {
                        memberID: memberIDValidate()
                    },
                    payload: {
                        coreHours: Joi.date().required()
                    }
                }
            },
            handler: async (request, h) =>{
            }
        },
        {
            method: "POST",
            path: "/api/{memberID}/commitments",
            config: {
                description: "Create new commitment for member.",
                validate: {
                    params: {
                        memberID: memberIDValidate()
                    },
                    payload: {
                        startTime: Joi.date().required(),
                        endTime: Joi.date().required(),
                        loc: Joi.string()
                    }
                }
            },
            handler: async (request, h) =>{
            }
        },
        {
            method: "PATCH",
            path: "/api/{memberID}/commitments",
            config: {
                description: "Update commitment for member.",
                validate: {
                    params: {
                        memberID: memberIDValidate()
                    },
                    payload: {
                        startTime: Joi.date(),
                        endTime: Joi.date(),
                        loc: Joi.string()
                    }
                }
            },
            handler: async (request, h) =>{
            }
        },
        {
            method: "DELETE",
            path: "/api/{memberID}/commitments",
            config: {
                description: "Delete commitment for member.",
                validate: {
                    params: {
                        memberID: memberIDValidate()
                    }
                }
            },
            handler: async (request, h) =>{
            }
        },
        {
            method: "PATCH",
            path: "/api/{teamID}/activities/{activityID}",
            config: {
                description: "Voting/Confirming an activity",
                validate: {
                    params: {
                        teamID: teamIDValidate(),
                        activityID: Joi.number().integer().description("Unique activityID for activity.")
                    },
                    payload: {
                        memberID: memberIDValidate(),
                        vote: Joi.string(),
                        conf: Joi.boolean()
                    }
                }
            },
            handler: async (request, h) =>{
            }
        }
    ]);

    await server.start();
    server.logger().info(`Server running at ${server.info.uri}`);
}

// process.on("unhandledRejection", err => {
//     server.logger().error(err);
//     process.exit(1);
// });

init();
