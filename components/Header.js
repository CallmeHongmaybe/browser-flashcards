import Link from "next/link"
import Image from "next/image"

function Header() {
    return (
        <>
            <header className="flex desktop:flex-row items-center justify-between phone:flex-col py-8">
                <Link href="/">
                    <Image src="/study-studio-logo.png" alt="Vercel Logo" width="200" height="50" />
                </Link>
                <span className="w-1/3 tablet:w-1/2 phone:w-1/2 flex justify-around">
                    <Link href="/">
                        <a className={`p-2 rounded text-black hover:bg-gray-200 hover:text-green-700 transition-colors duration-300`}>Home</a>
                    </Link>
                    <Link href="/about">
                        <a className={`p-2 rounded text-black hover:bg-gray-200 hover:text-green-700 transition-colors duration-300`}>About</a>
                    </Link>
                    <Link href="/collection">
                        <a className={`p-2 rounded text-black hover:bg-gray-200 hover:text-green-700 transition-colors duration-300`}>Collection</a>
                    </Link>
                </span>
            </header>
        </>
    )
}

export default Header