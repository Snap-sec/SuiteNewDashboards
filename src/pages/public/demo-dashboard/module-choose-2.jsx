import React from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toAbsoluteUrl } from '@/lib/helpers';
import { LogOut, ArrowRight, Lock } from 'lucide-react';

const products = [
    {
        logo: 'vm.svg',
        title: 'VM',
        name: 'Vulnerability Management',
        link: '/demo',
        locked: false,
    },
    {
        logo: 'asm.svg',
        title: 'ASM',
        name: 'Attack Surface Management',
        link: '/demo/asm-dashboard',
        locked: false,
    },
    {
        logo: 'aim.svg',
        title: 'AIM',
        name: 'Asset Inventory Management',
        link: '/demo',
        locked: false,
    },
    {
        logo: 'vs.svg',
        title: 'VS',
        name: 'Vulnerability Scanner',
        link: '/demo',
        locked: false,
    },
    {
        logo: 'was.svg',
        title: 'WAS',
        name: 'Web Application Scanner',
        link: '/demo',
        locked: true,
    },
];

const orbitStyles = `
/* ── Orbit Keyframes ── */
@keyframes mc2-spin-orbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes mc2-counter-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}
@keyframes mc2-center-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb, 59, 130, 246), 0.15); }
  50% { box-shadow: 0 0 0 20px rgba(var(--color-primary-rgb, 59, 130, 246), 0); }
}
@keyframes mc2-fade-in {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes mc2-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
@keyframes mc2-orbit-dash {
  from { stroke-dashoffset: 1200; }
  to { stroke-dashoffset: 0; }
}
@keyframes mc2-node-enter {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
@keyframes mc2-float {
  0%, 100% { transform: translate(-50%, -50%) translateY(0); }
  50% { transform: translate(-50%, -50%) translateY(-4px); }
}

/* ── Orbit Container ── */
.mc2-orbit-container {
  position: relative;
  width: 520px;
  height: 520px;
}

@media (max-width: 640px) {
  .mc2-orbit-container {
    width: 340px;
    height: 340px;
  }
  .mc2-orbit-container .mc2-node { width: 80px; height: 80px; }
  .mc2-orbit-container .mc2-node-logo { height: 28px; }
  .mc2-orbit-container .mc2-node-title { font-size: 0.625rem; }
  .mc2-orbit-container .mc2-node-subtitle { display: none; }
  .mc2-orbit-container .mc2-center-hub { width: 100px; height: 100px; }
  .mc2-orbit-container .mc2-center-logo { height: 36px; width: 36px; }
  .mc2-orbit-container .mc2-connector-dot { width: 5px; height: 5px; }
}

/* ── Center Hub ── */
.mc2-center-hub {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: mc2-fade-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both,
             mc2-center-pulse 3s ease-in-out 1s infinite;
}

/* ── Orbit Ring (SVG) ── */
.mc2-orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* ── Product Nodes ── */
.mc2-node {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  z-index: 5;
  animation: mc2-node-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.mc2-node:hover {
  transform: translate(-50%, -50%) scale(1.12) !important;
  z-index: 20;
}

.mc2-node-idle {
  animation: mc2-node-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both,
             mc2-float 4s ease-in-out infinite;
}

/* ── Connector dots on the orbit ring ── */
.mc2-connector-dot {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  z-index: 3;
  animation: mc2-fade-in 0.4s ease-out both;
}

/* ── Tooltip on hover ── */
.mc2-tooltip {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.mc2-node:hover .mc2-tooltip {
  opacity: 1;
}
`;

function getNodePosition(index, total, radius) {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // start from top
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y, angle };
}

function ProductNode({ product, index, total, radius }) {
    const { x, y } = getNodePosition(index, total, radius);
    const delay = 300 + index * 120;

    const content = (
        <div
            className={`mc2-node mc2-node-idle border bg-card shadow-xs shadow-black/5 ${
                product.locked ? 'opacity-70' : 'hover:border-primary/50 hover:shadow-md'
            }`}
            style={{
                transform: `translate(-50%, -50%)`,
                marginLeft: `${x}px`,
                marginTop: `${y}px`,
                animationDelay: `${delay}ms, ${600 + index * 300}ms`,
            }}
        >
            {product.locked && (
                <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] rounded-2xl flex items-center justify-center z-10">
                    <Lock size={16} className="text-muted-foreground" />
                </div>
            )}
            <img
                src={toAbsoluteUrl(`/media/logos/${product.logo}`)}
                className="mc2-node-logo h-[36px] w-auto shrink-0"
                alt={product.title}
            />
            <span className="mc2-node-title text-xs font-semibold text-foreground">
                {product.title}
            </span>

            {/* Hover tooltip */}
            <div className="mc2-tooltip">
                <div className="bg-popover border border-border rounded-lg px-3 py-1.5 shadow-md">
                    <p className="text-xs font-medium text-foreground">{product.name}</p>
                    {!product.locked && (
                        <p className="text-[10px] text-primary flex items-center gap-0.5 mt-0.5">
                            Open <ArrowRight size={10} />
                        </p>
                    )}
                    {product.locked && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">Access Restricted</p>
                    )}
                </div>
            </div>
        </div>
    );

    if (product.locked) return content;

    return (
        <Link to={product.link} className="contents">
            {content}
        </Link>
    );
}

function ConnectorDot({ index, total, radius }) {
    const midRadius = radius * 0.5;
    const { x, y } = getNodePosition(index, total, midRadius);
    const delay = 500 + index * 100;

    return (
        <div
            className="mc2-connector-dot bg-primary/30"
            style={{
                marginLeft: `${x}px`,
                marginTop: `${y}px`,
                animationDelay: `${delay}ms`,
            }}
        />
    );
}

export default function ModuleChoose2Page() {
    const total = products.length;
    const orbitRadius = 200; // px from center (desktop)

    return (
        <>
            <style>{orbitStyles}</style>
            <div className="w-full min-h-screen flex flex-col items-center justify-start overflow-hidden bg-background">
                {/* Header */}
                <div
                    className="w-full flex flex-col items-center gap-2 pt-10 lg:pt-14 pb-4 px-4"
                    style={{ animation: 'mc2-fade-in 0.5s ease-out both' }}
                >
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Welcome back,{' '}
                        <span className="text-primary">Shoaib</span>
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Select a module to get started
                    </p>
                </div>

                {/* Orbital Layout */}
                <div className="flex-1 flex items-center justify-center px-4 py-4">
                    <div className="mc2-orbit-container">
                        {/* SVG Orbit Rings */}
                        <svg
                            className="mc2-orbit-ring"
                            width="520"
                            height="520"
                            viewBox="0 0 520 520"
                            style={{ width: '100%', height: '100%' }}
                        >
                            {/* Outer orbit track */}
                            <circle
                                cx="260"
                                cy="260"
                                r={orbitRadius}
                                fill="none"
                                className="stroke-border"
                                strokeWidth="1"
                                strokeDasharray="6 6"
                                style={{
                                    animation: 'mc2-orbit-dash 30s linear infinite',
                                }}
                            />
                            {/* Inner decorative ring */}
                            <circle
                                cx="260"
                                cy="260"
                                r={orbitRadius * 0.5}
                                fill="none"
                                className="stroke-border/50"
                                strokeWidth="1"
                                strokeDasharray="3 8"
                                style={{
                                    animation: 'mc2-orbit-dash 20s linear infinite reverse',
                                }}
                            />
                            {/* Connector lines from center to each node */}
                            {products.map((_, i) => {
                                const { x, y } = getNodePosition(i, total, orbitRadius);
                                return (
                                    <line
                                        key={i}
                                        x1="260"
                                        y1="260"
                                        x2={260 + x}
                                        y2={260 + y}
                                        className="stroke-border/30"
                                        strokeWidth="1"
                                        strokeDasharray="4 4"
                                    />
                                );
                            })}
                        </svg>

                        {/* Center Hub */}
                        <div className="mc2-center-hub bg-card border-2 border-primary/20">
                            <div className="flex flex-col items-center gap-1.5">
                                <img
                                    src={toAbsoluteUrl('/media/logos/snapsec.svg')}
                                    className="mc2-center-logo h-10 w-10"
                                    alt="Snapsec Suite"
                                />
                                <span className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">
                                    Suite
                                </span>
                            </div>
                        </div>

                        {/* Connector Dots */}
                        {products.map((_, i) => (
                            <ConnectorDot key={`dot-${i}`} index={i} total={total} radius={orbitRadius} />
                        ))}

                        {/* Product Nodes */}
                        {products.map((product, i) => (
                            <ProductNode
                                key={i}
                                product={product}
                                index={i}
                                total={total}
                                radius={orbitRadius}
                            />
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="pb-8 flex flex-col items-center gap-3"
                    style={{ animation: 'mc2-fade-in 0.5s ease-out 0.8s both' }}
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
