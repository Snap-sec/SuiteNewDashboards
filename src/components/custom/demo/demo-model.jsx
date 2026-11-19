import { useState, useEffect } from 'react';
import { Calendar, Sparkles, Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';

const CALENDAR_LINK = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2HVhiBMIPPk7HRTjagMHnFdXPa4xD901AFoXdYxBq8oF9bZF-T6Ai9WT_tJ5wJhM4CHxjExNCP';

function DemoModal({ trigger, autoShow = false }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!autoShow) return;

        const hasDismissedDemo = localStorage.getItem('hasDismissedDemoModal');
        if (hasDismissedDemo) return;

        const userStr = localStorage.getItem('user');
        if (!userStr) return;

        try {
            const user = JSON.parse(userStr);
            if (!user?.is_demo) return;

            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 6000);

            return () => clearTimeout(timer);
        } catch (e) {
            console.error('Error parsing user from localStorage:', e);
        }
    }, [autoShow]);

    const handleBookDemo = () => {
        localStorage.setItem('hasDismissedDemoModal', 'true');
        window.open(CALENDAR_LINK, '_blank');
        setIsOpen(false);
    };

    const handleClose = () => {
        localStorage.setItem('hasDismissedDemoModal', 'true');
        setIsOpen(false);
    };

    const features = [
        {
            icon: <Sparkles className="size-5 text-primary" />,
            title: 'Personalized Walkthrough',
            description: 'Get a tailored demo based on your security needs',
        },
        {
            icon: <Clock className="size-5 text-primary" />,
            title: '30 Minutes Session',
            description: 'Quick and focused demonstration of key features',
        },
        {
            icon: <Users className="size-5 text-primary" />,
            title: 'Expert Guidance',
            description: 'Learn from our security specialists',
        },
    ];

    return (
        <Modal
            open={isOpen}
            setOpen={(open) => {
                if (!open) {
                    handleClose();
                } else {
                    setIsOpen(open);
                }
            }}
            trigger={trigger}
            title=""
            description=""
            className="sm:max-w-lg"
        >
            <div className="flex flex-col items-center text-center pb-2">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="size-8 text-primary" />
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Welcome to SnapSec! 👋
                </h2>
                <p className="text-muted-foreground mb-6">
                    Schedule a personalized demo to discover how our platform can strengthen your security posture.
                </p>

                <div className="w-full space-y-3 mb-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 text-left"
                        >
                            <div className="shrink-0 mt-0.5">
                                {feature.icon}
                            </div>
                            <div>
                                <h4 className="font-medium text-foreground text-sm">
                                    {feature.title}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col w-full gap-2">
                    <Button
                        size="lg"
                        className="w-full"
                        onClick={handleBookDemo}
                    >
                        <Calendar className="size-4" />
                        Book a Demo
                        <ArrowRight className="size-4" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                    >
                        Maybe later
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default DemoModal;