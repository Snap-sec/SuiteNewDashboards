import { Card, CardContent, CardHeader, CardHeading, CardTitle, CardToolbar } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Section card wrapper with a colored icon and title in the header.
 */
const SectionCard = ({ icon, iconColor, title, children, className, toolbar, contentClassName }) => {
    return (
        <Card className={cn('overflow-visible', className)}>
            <CardHeader>
                <CardHeading>
                    <div className="flex items-center gap-2.5">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest">
                            {title}
                        </CardTitle>
                    </div>
                </CardHeading>
                {toolbar && (
                    <CardToolbar>
                        {toolbar}
                    </CardToolbar>
                )}
            </CardHeader>
            <CardContent className={cn('p-0', contentClassName)}>
                {children}
            </CardContent>
        </Card>
    );
};

export default SectionCard;
