
import { CardUserMini } from "./components/card-user-mini";

function ServiceTypeOrgs() {


    const items = [
        {
            avatar: {
                className: "size-20 relative",
                image: "https://www.google.com/s2/favicons?sz=128&domain=google.com",
                imageClass: "rounded-full bg-white",
                badgeClass:
                    "flex size-2.5 bg-green-500 rounded-full absolute bottom-0.5 start-16 transform -translate-y-1/2",
            },
            name: "Google",
            email: "google.com",
            website: "https://google.com",
            verify: true,
            url: "/"
        },
        {
            avatar: {
                className: "size-20 relative",
                image: "https://www.google.com/s2/favicons?sz=128&domain=microsoft.com",
                imageClass: "rounded-full bg-white",
                badgeClass:
                    "flex size-2.5 bg-green-500 rounded-full absolute bottom-0.5 start-16 transform -translate-y-1/2",
            },
            name: "Microsoft",
            email: "microsoft.com",
            website: "https://microsoft.com",
            verify: true,
            url: "/"
        },
        {
            avatar: {
                className: "size-20 relative",
                image: "https://www.google.com/s2/favicons?sz=128&domain=openai.com",
                imageClass: "rounded-full bg-white",
                badgeClass:
                    "flex size-2.5 bg-green-500 rounded-full absolute bottom-0.5 start-16 transform -translate-y-1/2",
            },
            name: "OpenAI",
            email: "openai.com",
            website: "https://openai.com",
            verify: true,
            url: "/"
        },
        {
            avatar: {
                className: "size-20 relative",
                image: "https://www.google.com/s2/favicons?sz=128&domain=microsoft.com",
                imageClass: "rounded-full bg-white",
                badgeClass:
                    "flex size-2.5 bg-green-500 rounded-full absolute bottom-0.5 start-16 transform -translate-y-1/2",
            },
            name: "Microsoft",
            email: "microsoft.com",
            website: "https://microsoft.com",
            verify: true,
            url: "/"
        },

    ];


    const renderItem = (item, index) => (
        <CardUserMini
            avatar={item.avatar}
            name={item.name}
            email={item.email}
            verify={item.verify}
            url={item.url}
            key={index}
        />
    );

    return (
        <div className='w-full min-h-screen flex flex-col items-center justify-start overflow-auto p-4 mt-6'>
            <div className="flex flex-col gap-3 mb-10 mx-auto text-center lg:mt-10">
                <p className="text-3xl font-medium text-mono">Welcome Back Hacker TOKEN TEST!</p>
                <p className="text-sm text-secondary-foreground">Choose the organization you want to access.</p>
            </div>
            <div className="grid grid-cols-4 lg:gap-7.5 w-full">
                {items.map((item, index) => {
                    return renderItem(item, index);
                })}
            </div>
        </div>
    )
}

export default ServiceTypeOrgs;