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

const Joi = require("joi");
const Hapi = require('hapi');

const server = Hapi.server({ 
    host: "localhost",
    port: 3000,
    /*routes: {
        files: {
            relativeTo: Path.join(_dirname, "dist")
        }
    }*/
});


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
            }
        },
        {
            method: "GET",
            path: "/api/{memberID}",
            config: {
                description: "Get and display activites",
                validate: {
                    params: {
                        memberID: Joi.number().integer().description("Unique member ID for member.")//TODO: Can we make this a single time?
                    }
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
                        memberID: Joi.number().integer().description("unique memberID for member.")
                    }
                }
            }
        },
        {
            method: "GET",
            path: "/api/{memberID}/commitments",
            config: {
                description: "Retrieve all commitments for a member.",
                validate: {
                    params: {
                        memberID: Joi.number().integer().description("Unique memberID for member.")
                    }
                }
            }
        },
        {
            method: "POST",
            path: "/api/teams",
            config: {
                description: "Create new team",
                validate: {
                    payload: {
                        teamName: Joi.string.required().description("Name of team.")
                    }
                }
            }
        },
        {
            method: "PATCH",//TODO:Is this correct?
            path: "/api/teams/{teamID}/{memberID}",
            config: {
                description: "Add a member to a team.",
                validate: {
                    params: {
                        teamID: Joi.number().required().description("Unique identifier for a team."),
                        memberID: Joi.number().required().description("Unique identifier for a member.")
                    }
                }
            }
        },
        {
            method: "DELETE",
            path: "/api/teams/{teamID}/{memberID}",//FIXME: make member a payload object
            config: {
                description: "Remove a member from a team.",
                validate: {
                    params: {
                        teamID: Joi.number().required().description("Unique identifier for a team."),
                        memberID: Joi.number().required().description("Unique identifier for a member.")
                    }
                }
            }
        },
        {
            method: "PATCH",
            path: "/api/{memberID}",
            config: {
                description: "Update member core hours.",
                validate: {
                    params: {
                        memberID: Joi.number().integer().description("Unique memberID for member.")
                    },
                    payload: {
                        coreHours: Joi.date().required()
                    }
                }
            }
        },
        {
            method: "POST",
            path: "/api/{memberID}/commitments",
            config: {
                description: "Create new commitment for member.",
                validate: {
                    params: {
                        memberID: Joi.number().integer().description("Unique memberID for member.")
                    },
                    payload: {
                        startTime: Joi.date().required(),
                        endTime: Joi.date().required(),
                        loc: Joi.string()
                    }
                }
            }
        },
        {
            method: "PATCH",
            path: "/api/{memberID}/commitments",
            config: {
                description: "Update commitment for member.",
                validate: {
                    params: {
                        memberID: Joi.number().integer().description("Unique memberID for member.")
                    },
                    payload: {
                        startTime: Joi.date(),
                        endTime: Joi.date(),
                        loc: Joi.string()
                    }
                }
            }
        },
        {
            method: "DELETE",
            path: "/api/{memberID}/commitments",
            config: {
                description: "Delete commitment for member.",
                validate: {
                    params: {
                        memberID: Joi.number().integer().description("Unique memberID for member.")
                    }
                }
            }
        },
        {
            method: "POST",
            path: "/api/{teamID}/activities",
            config: {
                description: "Post a new activity.",
                validate: {
                    params: {
                        teamID: Joi.number().integer().description("Unique teamID for team.")
                    },
                    payload: {
                        loc: Joi.string().required(),
                        startTime: Joi.date(),
                        endTime: Joi.date(),
                        duration: Joi.number()
                    }
                }
            }
        },
        {
            method: "PATCH",
            path: "/api/{teamID}/activities/{activityID}",
            config: {
                description: "Voting/Confirming an activity",
                validate: {
                    params: {
                        teamID: Joi.number().integer().description("Unique teamID for team."),
                        activityID: Joi.number().integer().description("Unique activityID for activity.")
                    },
                    payload: {
                        memberID: Joi.number().required().description("Unique memberID"),
                        vote: Joi.string(),
                        conf: Joi.boolean()
                    }
                }
            }
        }
    ]);

    await server.start();
    server.logger().info(`Server running at ${server.info.uri}`);
}

process.on("unhandledRejection", err => {
    server.logger().error(err);
    process.exit(1);
});

init();
