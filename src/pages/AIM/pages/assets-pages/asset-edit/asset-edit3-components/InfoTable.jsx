import { isValidElement } from 'react';
import { cn } from '@/lib/utils';

/**
 * Safely render a value – if it is a plain object (not a React element),
 * convert it to a string so React doesn't throw.
 */
const safeRender = (value) => {
    if (value === null || value === undefined) return '—';
    if (isValidElement(value)) return value;
    if (typeof value === 'object') return JSON.stringify(value);
    return value;
};

/**
 * Reusable key-value information table.
 * Renders rows of label → value pairs inside a card-like structure.
 */
const InfoTable = ({ rows = [], className }) => {
    if (!rows || rows.length === 0) return null;

    return (
        <div className={cn('w-full overflow-hidden', className)}>
            <table className="w-full text-sm">
                <tbody>
                    {rows.map((row, index) => (
                        <tr
                            key={index}
                            className="border-b border-border/50 last:border-b-0 transition-colors hover:bg-muted/20"
                        >
                            <td className="py-3 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap w-[200px]">
                                {row.label}
                            </td>
                            <td className="py-3 px-5 text-sm text-foreground">
                                {row.render ? row.render(row.value) : (
                                    <span className={cn(
                                        row.highlight ? 'font-medium' : '',
                                        row.className
                                    )}>
                                        {safeRender(row.value)}
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InfoTable;
