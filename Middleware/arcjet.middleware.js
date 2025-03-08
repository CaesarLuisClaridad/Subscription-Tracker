import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    console.log("Arcjet middleware is running..."); 
    try {
        const decision = await aj.protect(req, { requested: 1 });

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){ //spamming
                return res.status(429).json({ error: "Too many requests" });
            }
            if(decision.reason.isBot()){ //bots
                return res.status(403).json({ error: "No Bots Allowed"})
            }

            return res.status(403).json({ error: "Access Denied" });
        }
        next();
    } catch (error) {
        console.log(`Arcjet middleware: ${error}`)
        next(error);
    }
}

export default arcjetMiddleware;