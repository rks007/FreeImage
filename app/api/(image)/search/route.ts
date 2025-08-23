import dbConnect from "@/lib/db";
import Image from "@/models/image";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {

    const {searchParams} = new URL(req.url);
}

export async function POST(req: NextRequest) { //for search when you are typing in search box
    const {searchText} = await req.json();

    try {

        //vaildate for text, means its not empty
        if(!searchText){
            return Response.json({message: "Search text is required"}, {status: 400});
        }
        // db logic to search images with like operator used on description
        await dbConnect();
        const images = await Image.find({
            description: {
                $regex: searchText,
                $options: "i" //case insensitive
            }
        })

        return Response.json(images);

    } catch (error) {
        console.log("error searching images", error);
        return Response.json({
            message: "error searching images"
        }, {status:500})
    }
}