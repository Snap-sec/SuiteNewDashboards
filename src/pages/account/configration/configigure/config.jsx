import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Eye, EyeOff, Copy, Mail, Server, User, Key, Info, CheckCircle2, Shield, UserCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Input, InputWrapper } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import PageHeading from '@/components/custom/page-heading';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function Config() {
    const [showPassword, setShowPassword] = useState(false);
    const { copy, copied } = useCopyToClipboard();
    const [formData, setFormData] = useState({
        smtpHost: '',
        port: '',
        username: '',
        password: '',
        fromName: '',
        fromEmail: '',
        useTls: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleTls = (checked) => {
        setFormData(prev => ({ ...prev, useTls: checked }));
    };

    const handleCopy = () => {
        if (formData.password) {
            copy(formData.password);
            toast.success('Password copied to clipboard');
        } else {
            toast.error('Nothing to copy');
        }
    };

    const handleSave = () => {
        toast.success('SMTP Settings saved successfully');
        // Implementation for saving would go here
    };

    const handleTestEmail = () => {
        toast.info('Sending test email...');
        // Implementation for testing would go here
    };

    return (
        <div className="p-4">
            <Helmet>
                <title>Account | Configuration</title>
            </Helmet>



            <div className=" space-y-6">
                <header className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold tracking-tight">Email / SMTP</h2>
                        <Badge variant="dim_gray" className="rounded-full flex items-center gap-1.5 py-0.5 px-2 bg-muted/50 text-muted-foreground border-none">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500"></span>
                            </span>
                            Not set
                        </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                        Configure a custom SMTP server to send transactional emails like login alerts, notifications, and reports directly from your own professional domain.
                    </p>
                </header>

                <Card >
                    <CardContent className="p-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 p-8 gap-8">
                            {/* Host & Port */}
                            <div className="space-y-4 md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-3 space-y-2.5">
                                    <div className="flex items-center gap-2">
                                        <Server size={14} className="text-primary/60" />
                                        <Label htmlFor="smtpHost" className="text-sm">SMTP HOST</Label>
                                    </div>
                                    <Input
                                        id="smtpHost"
                                        name="smtpHost"
                                        placeholder="e.g. smtp.gmail.com"
                                        value={formData.smtpHost}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="md:col-span-1 space-y-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm">PORT</div>
                                    </div>
                                    <Input
                                        id="port"
                                        name="port"
                                        placeholder="587"
                                        value={formData.port}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div className="space-y-2.5 md:col-span-1">
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-primary/60" />
                                    <Label htmlFor="username" className="text-sm">USERNAME / EMAIL</Label>
                                </div>
                                <Input
                                    id="username"
                                    name="username"
                                    placeholder="name@domain.com"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2.5 md:col-span-1">
                                <div className="flex items-center gap-2">
                                    <Key size={14} className="text-primary/60" />
                                    <Label htmlFor="password" className="text-sm">PASSWORD / APP PASSWORD</Label>
                                </div>
                                <InputWrapper className="pr-1">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••••••••"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <div className="flex items-center gap-0.5">
                                        <TooltipProvider delayDuration={300}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="dim"
                                                        size="icon"
                                                        className="h-7 w-7 text-muted-foreground/60 hover:text-foreground"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>{showPassword ? 'Hide' : 'Show'} Password</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="dim"
                                                        size="icon"
                                                        className="h-7 w-7 text-muted-foreground/60 hover:text-foreground"
                                                        onClick={handleCopy}
                                                    >
                                                        {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Copy to Clipboard</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </InputWrapper>
                            </div>

                            {/* From fields */}
                            <div className="space-y-2.5 md:col-span-1">
                                <div className="flex items-center gap-2">
                                    <UserCircle size={14} className="text-primary/60" />
                                    <Label htmlFor="fromName" className="text-sm">FROM NAME</Label>
                                </div>
                                <Input
                                    id="fromName"
                                    name="fromName"
                                    placeholder="e.g. SnapSec Admin"
                                    value={formData.fromName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2.5 md:col-span-1">
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-primary/60" />
                                    <Label htmlFor="fromEmail" className="text-sm">FROM EMAIL</Label>
                                </div>
                                <Input
                                    id="fromEmail"
                                    name="fromEmail"
                                    placeholder="noreply@snapsec.com"
                                    value={formData.fromEmail}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Security */}
                            <div className="md:col-span-2 pt-4 border-t border-muted/30">
                                <div className="flex items-center justify-between hover:bg-muted/10 p-4 -m-4 rounded-lg transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary/20 transition-all">
                                            <Shield size={18} />
                                        </div>
                                        <div className="space-y-0.5">
                                            <Label className="text-[15px] font-semibold cursor-pointer">Use TLS / SSL Security</Label>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Info size={12} className="text-blue-500" />
                                                Highly recommended for Port 465 (SMTPS)
                                            </div>
                                        </div>
                                    </div>
                                    <Switch
                                        id="security-toggle"
                                        checked={formData.useTls}
                                        onCheckedChange={handleToggleTls}
                                        className="data-[state=checked]:bg-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="px-8 py-6 bg-muted/20 border-t border-muted/50 flex flex-wrap gap-4 items-center">
                            <Button
                                onClick={handleSave}
                                className="bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white font-semibold px-10 h-11 shadow-lg shadow-blue-500/20"
                            >
                                Save Changes
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleTestEmail}
                                className="h-11 px-8 font-semibold border-muted-foreground/20 hover:bg-background/60 backdrop-blur-sm transition-all shadow-sm active:scale-95"
                            >
                                Send Test Email
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Config;