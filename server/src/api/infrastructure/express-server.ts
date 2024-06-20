import cors from 'cors';
import express, {Express} from 'express';
import http from 'http';
import {Server as SocketIOServer} from 'socket.io';
import routes from "../routes";
import session from 'express-session';
import passport from "passport";
import {Strategy as LocalStrategy} from 'passport-local';
import User from "../../db/models/User";

export class ExpressServer {
    private express: Express = express();
    private server: http.Server;
    private io: SocketIOServer;
    private readonly port: string;
    private readonly secret: string;
    private readonly corsAllowedOrigins: string[];

    constructor(
        port: string,
        secret: string,
        allowedOrigins: string[] = ['http://localhost:5173']
    ) {
        this.port = port;
        this.secret = secret;
        this.corsAllowedOrigins = allowedOrigins;
        this.server = http.createServer(this.express);
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: this.corsAllowedOrigins,
                methods: ['GET', 'POST']
            }
        });
        this.configureMiddlewares();
        this.configureRoutes();
        this.configureSocketIO();
    }

    bootstrap(): void {
        this.server.listen(this.port, () => {
            console.log(`> Listening on port ${this.port}`);
        });
    }

    private configureRoutes(): void {
        this.express.use('/api', routes);
    }

    private configureMiddlewares(): void {
        const options: cors.CorsOptions = {
            origin: this.corsAllowedOrigins,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
        }

        this.express.use(cors(options));

        this.express.use(session({
            secret: this.secret,
            resave: false,
            saveUninitialized: false,
        }));

        this.express.use(passport.initialize());
        this.express.use(passport.session());

        passport.use(new LocalStrategy(
            {
                usernameField: 'email', // Utilise l'email comme nom d'utilisateur
                passwordField: 'password',
            },
            async (email: string, password: string, done): Promise<void> => {
                try {
                    const user = await User.findOne({ where: { email } });

                    // Vérifie si l'utilisateur existe et si le mot de passe est correct
                    if (!user || !user.validPassword(password)) {
                        return done(null, false, {message: 'Nom d\'utilisateur ou mot de passe incorrect'});
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        ));

        passport.serializeUser<any, any>((user, done: any) => {
            done(null, user.id);
        });

        passport.deserializeUser(async (id: number, done): Promise<void> => {
            try {
                const user = await User.findByPk(id);
                done(null, user);
            } catch (error) {
                done(error);
            }
        });
    }

    // TODO : Faire de vrai conversations en base
    private configureSocketIO(): void {
        this.io.on('connection', (socket) => {
            console.log('A user connected');

            const channelId = socket.handshake.query.channel;
            if (channelId) {
                socket.join(channelId);
                console.log(`User room ${channelId}`);
            }

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });

            socket.on('message', (message) => {
                const channelId: string = message.channel;
                console.log(`Received message for channel ${channelId}:`, message);

                // Envoyer le message à la salle de l'utilisateur cible
                this.io.to(channelId).emit('message', message);
            });
        });
    }
}