import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';


export const  getDataFromToken = async (req) =>
{
    try{
        const token = req.cookies.get("token").value || "";

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        return decodedData._id;
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