import { dbConnect } from "@/config/database";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt"
import { mailSender } from "@/utils/mailSender";

dbConnect();

export async function POST(NextRequest, NextResponse)
{
    try{
        const requestBody = await NextRequest.json();
        const {userName, email, password} = requestBody;

        console.log(requestBody); 

        const userExist = await User.findOne({email});

        if(userExist)
        {
            return NextRequest.status(400).json(
                {
                    success: false,
                    message: "User already exist"
                }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({userName: userName, email, password: hashedPassword});
        const hashedToken = await bcrypt.hash(newUser._id, 10);

        const updateUser = await User.findByIdAndUpdate(newUser._id, {$set:{
            verifyToken: hashedToken,
            verifyTokenExpiry: Date.now() + 1000 * 60 * 60
        }});

        const mailResponse = await mailSender(email, "Verify Yourself", `Verify your account using this link`, "verify_email", hashedToken);

        console.log(mailResponse);

        return NextRequest.status(200).json(
            {
                success: true,
                message: "User registered successfully",
                data: updateUser
            }
        );


    }
    catch(Error)
    {
        return NextResponse.status(500).json(
            {
                success: false,
                message: Error.message,
            }
        );
    }
}