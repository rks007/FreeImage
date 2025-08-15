import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import Image from "@/models/image";
import { NextRequest} from "next/server";


export async function POST(req: NextRequest) {
    const {title, description, category, image} = await req.json();

    try {
        //validate
        if(!title || !description || !category) {
            return Response.json({message: "All fields are required"}, {status: 400});
        }

        let cloudinaryResponse = null;
        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder: "free_images"});
        }

        await dbConnect();
        const newImage = await Image.create({
            title,
            description,
            category,
            imageUrl: cloudinaryResponse ? cloudinaryResponse.secure_url : null
        })

        return Response.json(newImage);

    } catch (error) {
        console.log("error creating a product", error);
        return Response.json({
            message: "error creating a product"
        }, {status:500})
        
    }
}