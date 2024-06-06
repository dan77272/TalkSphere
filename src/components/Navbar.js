export default function Navbar({usersWaiting, usersInChat}) {
    console.log(usersInChat)
    console.log(usersWaiting)

    return (
        <div className='flex justify-between items-center shadow-custom h-auto'>
            <div className="flex md:flex-row flex-col items-center md:gap-16 mx-4">
                <p className="text-[50px] m-2 font-bold">TalkSphere</p>
                <p className="text-[20px]">Talk to Strangers!</p>
            </div>
            <div className="mx-4">
                <p className="text-[15px] md:text-[25px]">{(usersWaiting || 0) + (usersInChat || 0)} online now</p>
            </div>
        </div>
    );
}