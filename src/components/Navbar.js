export default function Navbar({usersOnline}) {
    console.log(usersOnline)
    return (
        <div className='flex justify-between items-center shadow-custom h-auto'>
            <div className="flex md:flex-row flex-col items-center md:gap-16 mx-4">
                <p className="text-[50px] m-2 font-bold">TalkSphere</p>
                <p className="text-[20px]">Talk to Strangers!</p>
            </div>
            <div className="mx-4">
                <p className="text-[15px] md:text-[25px]">{usersOnline || 0} online now</p>
            </div>
        </div>
    );
}