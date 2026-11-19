

import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

function WorkspaceCard({
    name,
    description,
    onClick,
}) {
    return(
        <div className="p-3 border border-default rounded-md cursor-pointer hover:bg-accent hover:shadow-md">
           <div className='flex items-center justify-between'>
                <div className="flex items-center gap-2">
                    <img 
                        className="rounded-lg size-[40px] shrink-0 p-1" 
                        alt="image" 
                        src="/media/file-types/folder.svg"
                    />
                    <div className="flex flex-col">
                        <h3 className="text-sm font-medium">{name || 'N/A'}</h3>
                        <p className="text-xs text-muted-foreground">{description || 'N/A'}</p>
                    </div>
                </div>

                <div className='flex justify-end'>
                    <Link to={'/appsec/collections'}>
                        <Button variant="primary" onClick={onClick}>
                            Select
                        </Button>
                    </Link>
                </div>
           </div>
        </div>
    )
}

export default WorkspaceCard;