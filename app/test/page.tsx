import { getServerSession } from "next-auth"



const page = async () => {
    
    const session = await getServerSession();

    console.log("server", session?.user.email);


  return (
    <div>page</div>
  )
}

export default page