import { NextResponse } from "next/server";

const { dbConnect } = require("@/config/database");

dbConnect();

export async function GET()
{
    try
    {
        let response = NextResponse.json(
            {
                success: true,
                message: "User logged out successfully"
            },
            {status: 200}
        );

        response.cookies.set("token", "", {httpOnly: true, expires: new Date(0)});

        return response;
    }
    catch(Error)
    {
        return NextResponse.json(
            {
                success: false,
                message: Error.message
            },
            {
                status: 500
            }
        );
    }
}