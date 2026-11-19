import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';


function CVSSScoring() {
    return (
        <div>
            <Card>
                <CardContent className="py-8 px-6">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Info className="w-6 h-6 text-primary" />
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-center mb-3">
                        CVSS Scoring Active
                    </h2>

                    <p className="text-sm text-muted-foreground text-center mb-6">
                        Standard CVSS v3.1 scoring is currently in use. Switch to True Risk Scoring to configure custom risk parameters based on your organization's context.
                    </p>

                    <div className="bg-muted/50 rounded-lg p-5">
                        <h3 className="text-base font-semibold mb-3">About CVSS Scoring</h3>

                        <p className="text-sm text-muted-foreground mb-4">
                            CVSS (Common Vulnerability Scoring System) provides a standardized method for rating IT vulnerabilities. It produces a numerical score ranging from 0 to 10, with 10 being the most severe.
                        </p>

                        <div className="space-y-2.5">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-gray-400 flex-shrink-0"></div>
                                <span className="text-sm">0.0 - None</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-yellow-500 flex-shrink-0"></div>
                                <span className="text-sm">4.0-6.9 - Medium</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0"></div>
                                <span className="text-sm">0.1-3.9 - Low</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0"></div>
                                <span className="text-sm">7.0-8.9 - High</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></div>
                                <span className="text-sm">9.0-10.0 - Critical</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CVSSScoring;