import { NextResponse } from "next/server";
import User from "@/models/userModel";
import { getDataFromToken } from "@/utils/dataFromToken";

const { dbConnect } = require("@/config/database");

dbConnect();

export async function GET(req) {
    try {
        const userId = await getDataFromToken(req);

        const userExist = await User.findOne({ _id: userId }).select("-password");

        if (!userExist) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User does not exist"
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "User founded", 
                data: userExist
            },
            { status: 200 }
        );

    }
    catch (Error) {
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