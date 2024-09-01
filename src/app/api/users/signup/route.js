import { dbConnect } from "@/config/database";
import User from "@/models/userModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { mailSender } from "@/utils/mailSender";
import crypto from "crypto"; // For generating tokens

dbConnect();

export async function POST(req) {
    try {
        const requestBody = await req.json();
        const { userName, email, password } = requestBody;

        console.log(requestBody);

        // Check if the user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return NextResponse.json({
                success: false,
                message: "User already exists",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({ userName, email, password: hashedPassword });

        // Generate a verification token
        const verifyToken = crypto.randomBytes(32).toString('hex'); // Use crypto for generating a token
        const hashedToken = await bcrypt.hash(verifyToken, 10);

        // Update the user with the verification token and expiry time
        const updateUser = await User.findByIdAndUpdate(newUser._id, {
            $set: {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 1000 * 60 * 60, // 1 hour
            }
        }, { new: true });

        // Send the verification email
        const mailResponse = await mailSender(email, "Verify Yourself", `Verify your account using this link`, "verify_email", verifyToken);

        console.log(mailResponse);

        return NextResponse.json({
            success: true,
            message: "User registered successfully",
            data: {updateUser, mailResponse},
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}
