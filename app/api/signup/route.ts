import dbConnect from "@/lib/db";
import User from "@/models/user";
import { NextRequest } from "next/server";


export async function POST(request: NextRequest){
    const {name, email, password} = await request.json();

    try {
        await dbConnect();
        
        const user = await User.create({
            name,
            email,
            password
        })

        return Response.json(user);

    } catch (error) {
        console.log(error);
    }


}