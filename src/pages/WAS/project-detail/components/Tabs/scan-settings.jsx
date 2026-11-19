import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarIcon, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import Select from '@/components/custom/select';
import TimePicker from '@/components/custom/time-picker';
import { Switch } from '@/components/ui/switch';
import { useUpdateApisecProjectScanSettingsMutation } from '../../../../../services/apisec/projectsApi';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';


function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(now.getMinutes()).padStart(2, '0');
    return { hours: hoursStr, minutes: minutesStr, period };
}

function ScanSettings({ data }) {
    const params = useParams();
    const [updateScanSettings, { isLoading }] = useUpdateApisecProjectScanSettingsMutation();


    const [frequency, setFrequency] = useState('Weekly');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(getCurrentTime());
    const [selectedAssessment, setSelectedAssessment] = useState('');
    const [autoSync, setAutoSync] = useState(true);
    const [weekday, setWeekday] = useState(null);
    const [time2, setTime2] = useState(null);
    const [assessmentSearch, setAssessmentSearch] = useState('');

    const {
        data: assessments,
        isLoading: assessmentsLoading,
        isFetching: assessmentsFetching,
    } = useGetVmAssessmentsQuery({ search: assessmentSearch, limit: 20 });

    // Populate form with existing data
    useEffect(() => {
        if (data) {
            // Set frequency
            if (data.frequency) {
                const freq = data.frequency.charAt(0).toUpperCase() + data.frequency.slice(1).toLowerCase();
                setFrequency(freq);
            }

            // Set assessment ID
            if (data.assessmentId) {
                setSelectedAssessment(data.assessmentId);
            }

            // Set auto sync
            if (data.auto_sync !== undefined) {
                setAutoSync(data.auto_sync);
            }

            // Set time and weekday
            if (data.launchTime) {
                const dt = new Date(data.launchTime);
                setDate(dt);
                setTime2(dt);

                // Derive weekday number from date (0 = Sunday, 6 = Saturday)
                setWeekday(String(dt.getDay()));
            } else if (data.time) {
                const dt = new Date(data.time);
                setTime2(dt);

                // Set weekday if provided (should be a number 0-6)
                if (data.weekday !== undefined) {
                    setWeekday(String(data.weekday));
                }
            }
        }
    }, [data]);

    const weekdayOptions = [
        { label: 'Sunday', value: '0' },
        { label: 'Monday', value: '1' },
        { label: 'Tuesday', value: '2' },
        { label: 'Wednesday', value: '3' },
        { label: 'Thursday', value: '4' },
        { label: 'Friday', value: '5' },
        { label: 'Saturday', value: '6' },
    ];

    const assessmentOptions = assessments?.data?.assessments?.map((a) => ({
        label: a.title,
        value: a._id,
    })) || [];



    const handleSaveSettings = async () => {
        const payload = {
            frequency: frequency.toLowerCase(),
            assessmentId: selectedAssessment,
            auto_sync: autoSync,
        };

        if (frequency === 'Once') {
            if (!date || !time2) {
                toast.error('Please select both date and time for Once frequency.');
                return;
            }
            payload.date = date.toISOString();
            payload.time = time2.toISOString();
        } else {
            if (!time2) {
                toast.error('Please select a time.');
                return;
            }
            payload.time = time2.toISOString();
            if (frequency === 'Weekly') {
                if (!weekday) {
                    toast.error('Please select a weekday.');
                    return;
                }
                payload.weekday = parseInt(weekday, 10); // Send as number (0-6)
            }
        }

        if (autoSync && !selectedAssessment) {
            toast.error('Please select an assessment for Automatic Synchronization.');
            return;
        }

        try {
            await updateScanSettings({
                payload,
                projectId: params.id
            }).unwrap();
            toast.success('Settings saved successfully');
            console.log('Payload:', payload);
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to save settings');
            console.error('Error saving settings:', error);
        }
    };

    return (
        <Card className="w-full mb-6">
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <p>Scan Schedule</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">Frequency</p>
                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                variant={frequency === 'Once' ? 'secondary' : 'outline'}
                                onClick={() => setFrequency('Once')}
                            >
                                Once
                            </Button>
                            <Button
                                variant={frequency === 'Daily' ? 'secondary' : 'outline'}
                                onClick={() => setFrequency('Daily')}
                            >
                                Daily
                            </Button>
                            <Button
                                variant={frequency === 'Weekly' ? 'secondary' : 'outline'}
                                onClick={() => setFrequency('Weekly')}
                            >
                                Weekly
                            </Button>
                        </div>
                    </div>

                    {frequency === 'Once' && (
                        <div className="flex flex-col gap-2 mt-4 w-65">
                            <p className="text-sm text-muted-foreground">Date</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? date.toLocaleDateString() : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                                        initialFocus
                                        className="w-full"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}

                    {frequency === 'Weekly' && (
                        <div className="flex flex-col gap-2 mt-4 w-65">
                            <p className="text-sm text-muted-foreground">Weekday</p>
                            <Select
                                placeholder="Select weekday"
                                options={weekdayOptions}
                                value={weekday}
                                onChange={(selected) => {
                                    setWeekday(selected.value);
                                }}
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-2 mt-4 w-65">
                        <p className="text-sm text-muted-foreground">Time</p>
                        <TimePicker
                            value={time2}
                            onChange={(t) => {
                                setTime2(t);
                                toast.info(
                                    `Time set to: ${t ? t.toLocaleTimeString() : 'None'}`,
                                );
                            }}
                        />
                    </div>
                </div>

                <div className="mt-10">
                    <p>Vulnerability Synchronization Configuration</p>
                    <p className="text-[11px] mb-4">
                        Configure the vulnerability synchronization to your asset inventory.
                    </p>

                    <div className="flex items-center space-x-2 mb-4">
                        <Switch id="auto-sync" checked={autoSync} onCheckedChange={setAutoSync} />
                        <Label htmlFor="auto-sync">Automatic Synchronization</Label>
                    </div>

                    <div className="flex gap-2 items-center">
                        <Select
                            value={selectedAssessment}
                            options={assessmentOptions}
                            onChange={(option) => setSelectedAssessment(option?.value)}
                            onSearchChange={(s) => setAssessmentSearch(s)}
                            isSearching={assessmentsFetching}
                            enableSearch={true}
                            areOptionsNavigating={true}
                            placeholder="Select assessment"
                        />
                    </div>
                </div>
            </CardContent>
            <div className="border-t p-4 flex justify-end gap-3">

                <Button variant="outline" onClick={handleSaveSettings} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Updating...' : 'Update Settings'}
                </Button>
            </div>
        </Card>
    );
}

export default ScanSettings;