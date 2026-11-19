import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function SetupScreen({
    title = 'Setup',
    subTitle = 'Please follow the steps below to get started.',
    steps = [],
    engage = null
}) {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[calc(100vh-120px)] max-w-2xl mx-auto p-6 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-3">
                {title}
            </h1>
            <p className="text-muted-foreground mb-8">
                {subTitle}
            </p>

            {steps && steps.length > 0 && (
                <Card className="w-full text-left mb-6 bg-card/50 shadow-none border-border/50">
                    <CardContent className="p-0 flex flex-col">
                        {steps.map((step, index) => (
                            <div key={index} className="flex items-start gap-4 p-6 relative">
                                {index !== steps.length - 1 && (
                                    <div className="w-px bg-border absolute top-14 bottom-[-1.5rem] left-10 z-0 hidden sm:block"></div>
                                )}
                                <div className="flex flex-col items-center relative z-10">
                                    <div className="w-8 h-8 rounded-md bg-secondary/50 border border-border/50 flex items-center justify-center text-xs font-medium text-muted-foreground">
                                        {index + 1}
                                    </div>
                                </div>
                                <div className="flex flex-col pt-1 relative z-10">
                                    <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase mb-1">
                                        Step {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className="font-medium text-foreground mb-1">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}

                        <div className="p-4 flex items-center justify-center border-t border-border/50">
                            {engage}
                        </div>
                    </CardContent>
                </Card>
            )}


        </div>
    );
}