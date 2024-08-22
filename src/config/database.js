const mongoose = require("mongoose");

export async function dbConnect()
{
    try{
        mongoose.connect(process.env.DATABASE_URL);

        const connection = mongoose.connection;

        connection.on("connected", () =>
        {
            console.log("Database is connected successfully ");
        });

        // mongoose.connect(process.env.DATABASE_URL, {
        //     useUnifiedTopology: true,
        //     useNewUrlParser: true
        // });

        connection.on("error", (Error) =>
        {
            console.log("Make sure that the database is up ");
            console.log("This is the error of not running database ->", Error);
            process.exit(1);
        })
    }
    catch(Error)
    {
        console.log("DB is not connected");
        console.log("This is the error for no connected with database = ", Error);
    }
}