import dbConnect from "@/lib/db";
import Image from "@/models/image";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    const {searchText} = await req.json();

    try {

        //vaildate for text, means its not empty
        if(!searchText){
            return Response.json({message: "Search text is required"}, {status: 400});
        }

        // db logic to search images matching to text
        await dbConnect();
        const images = await Image.find({
            $or: [
                {title: {$regex: searchText, $options: "i"}},
                {description: {$regex: searchText, $options: "i"}},
            ]
        })

        return Response.json(images);
        
    } catch (error) {
        console.log("error searching images", error);
        return Response.json({
            message: "error searching images"
        }, {status:500})
        
    }
}

export async function GET(req: NextRequest) { //for search when you are typing in search box
    // const {searchText} = await req.json();
    const {searchParams} = new URL(req.url);

    try {

        //vaildate for text, means its not empty
        if(!searchParams.has("text")){
            return Response.json({message: "Search text is required"}, {status: 400});
        }
        // db logic to search images matching to tags
        await dbConnect();
        const images = await Image.find({
            tags: searchParams.get("text")
        })

        return Response.json(images);

    } catch (error) {
        console.log("error searching tags", error);
        return Response.json({
            message: "error searching tags"
        }, {status:500})
    }
}