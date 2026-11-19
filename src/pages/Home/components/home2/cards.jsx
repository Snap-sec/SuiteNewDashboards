import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';




function Cards({ count, value }) {
    return (
        <Card>
            <CardContent>
                <div className="flex lg:px-10 py-1.5 gap-2">
                    <div className="grid grid-cols-1 place-content-center flex-1 gap-1 text-center group cursor-pointer">
                        <span className="text-mono text-2xl lg:text-2xl group-hover:text-muted-foreground leading-none font-semibold">
                            {count}
                        </span>
                        <span className="text-secondary-foreground text-sm group-hover:text-muted-foreground ">
                            {value}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}


export default Cards;