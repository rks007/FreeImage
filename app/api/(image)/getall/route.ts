import dbConnect from "@/lib/db";
import Image from "@/models/image";


export async function GET() {
    //get sab images from db
    try {
        
        await dbConnect();
        const images = await Image.find().sort({createdAt: -1}); //latest images first
        return Response.json(images);

    } catch (error) {
        console.log("error getting all images", error);
        return Response.json({
            message: "error getting all images"
        }, {status:500})
    }

    //baad mein kabhi pagination karunga
}