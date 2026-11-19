import React, { useEffect } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { ArrowRight, Building2, Lock, LogOut, User } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import appConfig from '@/config/appConfig';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { useGetProductsOverviewQuery } from '../../services/auth/authApi';

const sanitizeDescription = (text) => {
    if (!text) return '';
    return text
        .replace(/vulnerability\s+management\s+platform/gi, 'platform')
        .replace(/vulnerability\s+management/gi, 'threat remediation')
        .replace(/attack\s+surface\s+management/gi, 'attack surface monitoring')
        .replace(/asset\s+inventory\s+management/gi, 'asset tracking')
        .replace(/cloud\s+security\s+management/gi, 'cloud security posture')
        .replace(/vulnerability\s+scanner/gi, 'vulnerability scan engine')
        .replace(/web\s+application\s+scanner/gi, 'web application scan engine')
        .replace(
            /software\s+composition\s+analysis/gi,
            'open-source dependency analysis',
        )
        .replace(
            /static\s+application\s+security\s+testing/gi,
            'static code security analysis',
        );
};

export default function Home3() {
    const { logout, auth } = useAuth();
    const navigate = useNavigate();

    const userAccess = auth?.accessTo || [];
    const userName = auth?.firstName || 'User';

    const { data: overviewResponse, isLoading } = useGetProductsOverviewQuery();

    const rawProducts = overviewResponse?.data?.products || [];
    const rawTools = overviewResponse?.data?.tools || [];

    const productsList = (
        rawProducts.length > 0 ? rawProducts : appConfig.PRODUCT_LIST
    ).map((prod) => {
        const isLocked =
            typeof prod.access === 'boolean'
                ? !prod.access
                : !userAccess?.includes(prod.id);

        const isApt =
            prod.id?.toLowerCase() === 'apt' ||
            prod.title?.toLowerCase() === 'apt' ||
            prod.name?.toLowerCase()?.includes('pentest') ||
            prod.name?.toLowerCase()?.includes('penetration');

        const logoFile = isApt
            ? 'apt.svg'
            : (prod.logo || `${prod.id?.toLowerCase()}.svg`);

        return {
            id: prod.id,
            badge: prod.title || prod.id,
            logo: logoFile,
            name: prod.name,
            description:
                sanitizeDescription(prod.description) || 'Manage security workspace',
            link: prod.link || '/',
            isLocked,
        };
    });

    const toolsList = rawTools.map((tool) => {
        const isLocked =
            typeof tool.access === 'boolean'
                ? !tool.access
                : !userAccess?.includes(tool.id);

        return {
            id: tool.id,
            badge: tool.title || tool.id,
            logo: tool.logo || 'workflow.svg',
            name: tool.name,
            description:
                sanitizeDescription(tool.description) || 'Build and deploy AI agents.',
            link: tool.link || '/ai-agent-builder',
            isLocked,
        };
    });

    const renderProductCard = (item) => (
        <div
            key={item.id}
            data-testid={`product-card-${item.id?.toLowerCase()}`}
            onClick={() => !item.isLocked && navigate(item.link)}
            className={`group flex items-center justify-between p-3.5 rounded-xl border bg-card/60 transition-all ${item.isLocked
                ? 'cursor-not-allowed opacity-80'
                : 'cursor-pointer hover:border-primary/50 hover:bg-card hover:shadow-sm'
                }`}
        >
            <div className="flex items-center gap-3.5 min-w-0 pr-2">
                <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 border border-primary/20">
                    <img
                        src={toAbsoluteUrl(`/media/logos/${item.logo}`)}
                        alt={item.badge}
                        className="w-11 h-11 object-contain"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = toAbsoluteUrl('/media/logos/was.svg');
                        }}
                    />
                </div>
                <div className="flex flex-col min-w-0">
                    <span
                        title={item.name}
                        data-testid={`product-name-${item.id?.toLowerCase()}`}
                        className={`font-medium text-sm ${item.isLocked ? 'text-muted-foreground' : 'text-foreground'} truncate group-hover:text-primary transition-colors`}
                    >
                        {item.name}
                    </span>
                    <span
                        title={item.description}
                        className="text-xs text-muted-foreground truncate"
                    >
                        {item.description}
                    </span>
                </div>
            </div>

            <div className="shrink-0 pl-1">
                {item.isLocked ? (
                    <Lock className="size-4 text-yellow-500" />
                ) : (
                    <ArrowRight className="size-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                )}
            </div>
        </div>
    );

    // If org is not created
    useEffect(() => {
        if (!auth.orgId) navigate('/auth/onboarding');
    }, [auth]);

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-start overflow-auto p-6 lg:p-12 bg-background text-foreground">
            <Helmet>
                <title>Snapsec | Workspace Selection</title>
            </Helmet>

            {/* Header */}
            <div className="flex flex-col items-center gap-2 mb-10 text-center lg:mt-6 max-w-2xl">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Welcome back,{' '}
                    <Link
                        to="/profile/account/user-info"
                        className="text-primary cursor-pointer"
                    >
                        {userName}
                    </Link>
                </h1>
                <p className="text-sm text-muted-foreground">
                    Choose a workspace to continue.
                </p>
            </div>

            <div className="w-full max-w-5xl flex flex-col gap-10">
                {/* Product Workspace Section */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 px-1">
                        PRODUCT WORKSPACE
                    </p>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3.5 rounded-xl border bg-card/60"
                                >
                                    <div className="flex items-center gap-3.5 min-w-0 pr-2 flex-1">
                                        <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
                                        <div className="flex flex-col gap-2 min-w-0 flex-1">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-full" />
                                        </div>
                                    </div>
                                    <Skeleton className="size-4 shrink-0" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {productsList.map(renderProductCard)}
                        </div>
                    )}
                </div>

                {/* Infrastructure & Settings Section */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 px-1">
                        INFRASTRUCTURE & SETTINGS
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Tools from Backend (e.g. AI Agent Builder) */}
                        {isLoading ? (
                            <div className="flex items-center justify-between p-3.5 rounded-xl border bg-card/60">
                                <div className="flex items-center gap-3.5 min-w-0 pr-2 flex-1">
                                    <Skeleton className="w-14 h-14 rounded-lg shrink-0" />
                                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-full" />
                                    </div>
                                </div>
                                <Skeleton className="size-4 shrink-0" />
                            </div>
                        ) : (
                            toolsList.map((tool) => (
                                <div
                                    key={tool.id}
                                    data-testid={`tool-card-${tool.id?.toLowerCase()}`}
                                    onClick={() => !tool.isLocked && navigate(tool.link)}
                                    className={`group flex items-center justify-between p-3.5 rounded-xl border bg-card/60 transition-all ${tool.isLocked
                                        ? 'cursor-not-allowed opacity-80'
                                        : 'cursor-pointer hover:border-primary/50 hover:bg-card hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-center gap-3.5 min-w-0 pr-2">
                                        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                            <img
                                                src={toAbsoluteUrl(`/media/logos/${tool.logo}`)}
                                                alt={tool.badge || tool.name}
                                                className="w-8 h-8 object-contain"
                                            />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span
                                                title={tool.name}
                                                data-testid={`tool-name-${tool.id?.toLowerCase()}`}
                                                className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors"
                                            >
                                                {tool.name}
                                            </span>
                                            <span
                                                title={tool.description}
                                                className="text-xs text-muted-foreground truncate"
                                            >
                                                {tool.description}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="shrink-0 pl-1">
                                        {tool.isLocked ? (
                                            <Lock className="size-4 text-muted-foreground/50" />
                                        ) : (
                                            <ArrowRight className="size-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}

                        {/* User Settings */}
                        <div
                            onClick={() => navigate('/profile/account/user-info')}
                            className="group flex items-center justify-between p-3.5 rounded-xl border bg-card/60 cursor-pointer hover:border-primary/50 hover:bg-card hover:shadow-sm transition-all"
                        >
                            <div className="flex items-center gap-3.5 min-w-0 pr-2">
                                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                    <User className="size-7 text-primary" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                                        User Settings
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate">
                                        Account & preferences
                                    </span>
                                </div>
                            </div>
                            <div className="shrink-0 pl-1">
                                <ArrowRight className="size-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                            </div>
                        </div>

                        {/* Company Settings */}
                        <AuthorityGuard roles={['Admin']}>
                            <div
                                onClick={() => navigate('/profile/account/company-profile')}
                                className="group flex items-center justify-between p-3.5 rounded-xl border bg-card/60 cursor-pointer hover:border-primary/50 hover:bg-card hover:shadow-sm transition-all"
                            >
                                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                        <Building2 className="size-7 text-primary" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                                            Company Settings
                                        </span>
                                        <span className="text-xs text-muted-foreground truncate">
                                            Org profile & branding
                                        </span>
                                    </div>
                                </div>
                                <div className="shrink-0 pl-1">
                                    <ArrowRight className="size-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                </div>
                            </div>
                        </AuthorityGuard>
                    </div>
                </div>

                {/* Logout */}
                <div className="flex items-center justify-center gap-1 mt-2 mb-6">
                    <LogOut className="text-primary" size={15} />
                    <Button mode="link" underlined="dashed" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
}
