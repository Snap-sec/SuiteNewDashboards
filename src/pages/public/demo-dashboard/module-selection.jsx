import React from 'react';
import { Link } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toAbsoluteUrl } from '@/lib/helpers';
import { LogOut, ArrowRight, Lock, Shield, Bug, MonitorSmartphone, Radar, Globe } from 'lucide-react';

const products = [
    {
        logo: 'vm.svg',
        title: 'VM',
        name: 'Vulnerability Management',
        description: 'Discover, prioritize, and remediate vulnerabilities across your infrastructure.',
        link: '/demo',
        locked: false,
        icon: Bug,
    },
    {
        logo: 'asm.svg',
        title: 'ASM',
        name: 'Attack Surface Management',
        description: 'Map and monitor your external attack surface continuously.',
        link: '/demo/asm-dashboard',
        locked: false,
        icon: Radar,
    },
    {
        logo: 'aim.svg',
        title: 'AIM',
        name: 'Asset Inventory Management',
        description: 'Centralized asset discovery, classification, and lifecycle tracking.',
        link: '/demo',
        locked: false,
        icon: MonitorSmartphone,
    },
    {
        logo: 'vs.svg',
        title: 'VS',
        name: 'Vulnerability Scanner',
        description: 'Automated scanning engine for web apps, APIs, and network infrastructure.',
        link: '/demo',
        locked: false,
        icon: Shield,
    },
    {
        logo: 'was.svg',
        title: 'WAS',
        name: 'Web Application Scanner',
        description: 'Deep crawl and scan web applications for OWASP Top 10 and beyond.',
        link: '/demo',
        locked: true,
        icon: Globe,
    },
];

/* ── CSS keyframes injected once ── */
const animationStyles = `
@keyframes ms-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}
@keyframes ms-fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes ms-pulse-ring {
  0% { transform: scale(0.85); opacity: 0.5; }
  50% { transform: scale(1); opacity: 0.15; }
  100% { transform: scale(0.85); opacity: 0.5; }
}
@keyframes ms-brand-enter {
  from { opacity: 0; transform: scale(0.7) rotate(-12deg); }
  to { opacity: 1; transform: scale(1) rotate(0deg); }
}
@keyframes ms-text-enter {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

function ProductCard({ logo, title, name, link, locked, index }) {
    const delay = index * 80;

    const inner = (
        <Card
            className={`h-full group relative overflow-hidden transition-all duration-300 ${
                !locked
                    ? 'cursor-pointer hover:border-primary/40 hover:shadow-md'
                    : 'opacity-80'
            }`}
            style={{
                animation: `ms-fade-up 0.5s ease-out ${delay}ms both`,
            }}
        >
            <CardContent className="flex flex-col items-center p-0 gap-0 h-full">
                {/* Logo Area */}
                <div className="w-full flex items-center justify-center py-10 px-6 bg-muted/40 group-hover:bg-primary/[0.04] transition-colors duration-300 relative">
                    {/* Pulse ring behind logo on hover */}
                    <div
                        className="absolute w-24 h-24 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ animation: 'ms-pulse-ring 2s ease-in-out infinite' }}
                    />
                    <img
                        src={toAbsoluteUrl(`/media/logos/${logo}`)}
                        className="h-[56px] w-auto shrink-0 relative z-10 transition-transform duration-500 ease-out group-hover:scale-110"
                        style={{
                            animation: `ms-float 4s ease-in-out ${index * 400}ms infinite`,
                        }}
                        alt={title}
                    />
                    {locked && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center z-20">
                            <div className="flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full">
                                <Lock size={13} className="text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground">Restricted</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col items-center gap-1.5 px-5 pt-5 pb-2 flex-1 w-full text-center">
                    <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                        {title}
                    </p>
                    <p className="text-[0.8125rem] text-muted-foreground leading-snug">
                        {name}
                    </p>
                </div>

                {/* CTA */}
                <div className="px-5 pb-5 pt-2 w-full flex justify-center">
                    {!locked ? (
                        <div className="flex items-center gap-1 text-primary text-[0.8125rem] font-medium opacity-60 group-hover:opacity-100 transition-all duration-200">
                            <span>Go to {title}</span>
                            <ArrowRight
                                size={14}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </div>
                    ) : (
                        <Badge variant="mono" size="sm">
                            Contact Admin
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    if (locked) return inner;

    return (
        <Link to={link} className="block h-full">
            {inner}
        </Link>
    );
}

export default function ModuleSelectionPage() {
    return (
        <>
            <style>{animationStyles}</style>
            <div className="w-full min-h-screen flex flex-col items-center justify-start overflow-auto bg-background">
                {/* Header */}
                <div className="w-full flex flex-col items-center gap-6 pt-12 lg:pt-20 pb-10 px-4">
                    {/* Brand */}
                    <div
                        className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 relative"
                        style={{ animation: 'ms-brand-enter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
                    >
                        <img
                            src={toAbsoluteUrl('/media/logos/snapsec.svg')}
                            className="h-8 w-8"
                            alt="Snapsec"
                        />
                    </div>

                    {/* Welcome */}
                    <div className="text-center space-y-2 max-w-lg">
                        <h1
                            className="text-3xl font-semibold tracking-tight text-foreground"
                            style={{ animation: 'ms-text-enter 0.5s ease-out 0.2s both' }}
                        >
                            Welcome back,{' '}
                            <span className="text-primary">Shoaib</span>
                        </h1>
                        <p
                            className="text-muted-foreground text-[0.9375rem]"
                            style={{ animation: 'ms-text-enter 0.5s ease-out 0.35s both' }}
                        >
                            Choose a product to access its dashboard.
                        </p>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="w-full px-4 pb-8">
                    <div className="w-full max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {products.map((product, index) => (
                                <ProductCard key={index} index={index} {...product} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <div
                    className="pb-10 flex flex-col items-center gap-3"
                    style={{ animation: 'ms-text-enter 0.5s ease-out 0.6s both' }}
                >
                    <Separator className="w-16 mb-1" />
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1.5">
                        <LogOut size={14} />
                        <span className="text-[0.8125rem]">Sign out</span>
                    </Button>
                </div>
            </div>
        </>
    );
}
