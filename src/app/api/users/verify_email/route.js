import { dbConnect } from "@/config/database";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

dbConnect();

export async function POST(req)
{
    try
    {
        const requestBody = await req.json();
        const {token} = requestBody;
        console.log(token);


        const userExist = await User.findOne({verifyToken: token});
        console.log(userExist);
        if(!userExist)
        {
            return NextResponse.json(
                {
                    success: false,
                    message: "User doesnot exist"
                },
                {
                    status: 404,
                }
            );
        }
        
        if(userExist.verifyTokenExpiry < Date.now())
            {
                
                return NextResponse.json(
                    {
                        success: false,
                        message: "Verify token has been expired try to regenerate it "
                    },
                    {
                        status: 404,
                    }
                );
        }

        userExist.verifyToken = undefined;
        userExist.verifyTokenExpiry = undefined;
        userExist.isVerified = true;

        await userExist.save();

        return NextResponse.json(
            {
                success: true,
                message: "Email verified successfully",
                data: userExist
            },
            {
                status: 200,
            }
        );

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