import User from "@/models/userModel";
import { NextResponse } from "next/server";
import {bcrypt} from "bcrypt";
import jwt from 'jsonwebtoken';


export async function POST(req)
{
    try
    {
        const requestBody = await req.json();
        const {email, password} = requestBody;

        const userExist = await User.findOne({email: email});
        if(!userExist)
        {
            return NextResponse.json(
                {
                    success: false,
                    message: "User doesnot exist! Try signup first"
                }
            );
        }

        const userPassword = userExist.password;

        if(!(await bcrypt.compare(userPassword, password)))
        {
            return NextResponse.json(
                {
                    success: false,
                    message: "Password is incorrect"
                },
                {
                    status: 403,
                }
            );
        }

        const payLoad = {
            _id: userExist._id,
            email: userExist.email
        };

        const jwtToken = jwt.sign(payLoad, process.env.JWT_SECRET, {expiresIn: '1d'});

        const res = NextResponse.json(
            {
                success: true,
                message: "Loggedin successfully"
            },
            {status: 200}
        );

        res.cookies.set("token", jwtToken, {
            httpOnly: true
        });

        return res;



    }
    catch(Error)
    {
        return NextResponse.json(
            {
                success: false,
                message: Error.message
            },
            {
                status: 500,
            }
        );
    }
}