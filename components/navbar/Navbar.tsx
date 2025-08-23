"use client"

import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {

  const session = useSession();

  const user = session.data?.user;

  // console.log("client", session.data?.user.role);
  

  const isAdmin = session.data?.user.role;

  return (
    <header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>

      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between">
        <Link  href={'/'} className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>
						FreeImage
				</Link>

        <nav className="flex flex-wrap items-center gap-4">
          <Link href={"/"} className=' text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>Home</Link>
          {/* {user && (
            <Link href={"/cart"} className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'>
              <ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
							
            </Link>
          )} */}
          {isAdmin && (
							<Link
								className='bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center'
								href={"/upload"}
							>
								<Lock className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Dashboard</span>
							</Link>
					)}
          {user ? (
							<button
								className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
						rounded-md flex items-center transition duration-300 ease-in-out' onClick={() => signOut()}>
								<LogOut size={18} />
								<span className='hidden sm:inline ml-2'>Log Out</span>
							</button>
						) : (
							<>
								<Link
									href={"/signup"}
									className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<UserPlus className='mr-2' size={18} />
									Sign Up
								</Link>
								<Link
									href={"/login"}
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
									onClick={() => signIn()}
								>
									<LogIn className='mr-2' size={18} />
									Login
								</Link>
							</>
						)}

        </nav>
        </div>
      </div>

    </header>
  )
}

export default Navbar