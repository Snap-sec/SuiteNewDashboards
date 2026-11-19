import { useEffect, useCallback, useState, useRef } from 'react';
import { pdfDebug } from '@/lib/pdf-debug';


/**
 * Hook to centralize and robustly handle the window.isPdfReady flag for Gotenberg report generation.
 * Handles pagination placeholder replacement and ensures the DOM is fully rendered.
 * 
 * @param {Object} params
 * @param {boolean} params.loading - Loading state of the report data
 * @param {any} params.data - The fetched report data
 * @param {boolean} [params.error] - Error state if fetching fails
 * @param {Object} [params.options] - Configuration options
 * @param {string} [params.options.paginationSelector='.page-number-placeholder'] - Selector for page number placeholders
 * @param {number} [params.options.readyDelay=1000] - Extra delay in ms after render to ensure charts/animations settle
 * @param {boolean} [params.options.autoReady=true] - Whether to automatically set isPdfReady when loading/data conditions are met
 */
export const useReportReady = ({
    loading,
    data,
    options = {}
}) => {
    const {
        paginationSelector = '.page-number-placeholder',
        readyDelay = 1000,
        autoReady = true
    } = options;

    const [reportStatus, setReportStatus] = useState('fetching');
    const hasStartedRendering = useRef(false);

    const STATUS_MESSAGES = {
        'fetching': 'Fetching report data...',
        'rendering': 'Synchronizing DOM and styles...',
        'images_loading': 'Waiting for images to load...',
        'syncing_pagination': 'Calculating page numbers...',
        'finalizing': 'Finalizing charts and layout...',
        'ready': 'Report is ready',
        'error': 'Error occurred, proceeding with available data...'
    };

    const setPdfReady = useCallback((isReady) => {
        window.isPdfReady = isReady;
        if (isReady) {
            setReportStatus('ready');
            console.log('[useReportReady] Report marked as READY for PDF generation');
            pdfDebug.pdfReady();
        } else {
            console.log('[useReportReady] Report marked as NOT READY');
        }
    }, []);

    const handleFullRender = useCallback(async () => {
        if (hasStartedRendering.current) return;
        hasStartedRendering.current = true;

        pdfDebug.logBetweenAction({ action: 'start-handleFullRender' });

        // Stage 1: Wait for double requestAnimationFrame to ensure React has flushed to DOM
        setReportStatus('rendering');
        pdfDebug.renderSummary();
        pdfDebug.logBetweenAction({ action: 'before-double-rAF' });
        await new Promise(resolve => {
            let resolved = false;
            const fallback = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    pdfDebug.logBetweenAction({ action: 'rAF-fallback-triggered' });
                    resolve();
                }
            }, 100);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (!resolved) {
                        resolved = true;
                        clearTimeout(fallback);
                        resolve();
                    }
                });
            });
        });
        pdfDebug.logBetweenAction({ action: 'after-double-rAF' });

        // Stage 2: Handle pagination placeholders if any
        setReportStatus('syncing_pagination');
        pdfDebug.logBetweenAction({ action: 'before-pagination-sync' });
        let placeholdersLength = 0;
        try {
            const placeholders = document.querySelectorAll(paginationSelector);
            placeholdersLength = placeholders.length;
            placeholders.forEach((el, index) => {
                el.innerText = index + 1;
            });
            console.log(`[useReportReady] Pagination handled for ${placeholders.length} pages`);
        } catch (e) {
            console.warn('[useReportReady] Error during pagination sync:', e);
        }
        pdfDebug.logBetweenAction({ action: 'after-pagination-sync', placeholdersCount: placeholdersLength });

        // Stage 3: Set background to white (standard for PDFs)
        pdfDebug.logBetweenAction({ action: 'before-background-change' });
        document.body.style.backgroundColor = 'white';
        pdfDebug.logBetweenAction({ action: 'after-background-change' });

        // Stage 4: Wait for any pending images to load
        setReportStatus('images_loading');
        pdfDebug.renderAssets();
        let imagesCount = 0;
        try {
            const images = Array.from(document.images);
            imagesCount = images.length;
            pdfDebug.logBetweenAction({ action: 'before-images-wait', imagesCount });
            const imagePromises = images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    const timer = setTimeout(resolve, 3000);
                    img.onload = () => { clearTimeout(timer); resolve(); };
                    img.onerror = () => { clearTimeout(timer); resolve(); };
                });
            });
            await Promise.all(imagePromises);
        } catch (e) {
            console.warn('[useReportReady] Error waiting for images:', e);
        }
        pdfDebug.logBetweenAction({ action: 'after-images-wait', imagesCount });

        // Stage 5: Final wait time for charts, animations, and settlement
        setReportStatus('finalizing');
        pdfDebug.renderCharts({ pagesDetected: placeholdersLength });
        pdfDebug.logBetweenAction({ action: 'before-final-delay', readyDelay });
        setTimeout(() => {
            pdfDebug.logBetweenAction({ action: 'triggering-setPdfReady' });
            setPdfReady(true);
        }, readyDelay);
    }, [paginationSelector, readyDelay, setPdfReady]);

    useEffect(() => {
        // Hard safety timeout: Set isPdfReady to true after 5 minutes (300,000ms) no matter what
        const hardTimeout = setTimeout(() => {
            if (!window.isPdfReady) {
                console.warn('[useReportReady] Hard safety timeout (5m) reached. Forcing isPdfReady = true');
                setPdfReady(true);
            }
        }, 300000);

        return () => clearTimeout(hardTimeout);
    }, [setPdfReady]);

    useEffect(() => {
        if (!autoReady) return;

        if (loading) {
            setPdfReady(false);
            setReportStatus('fetching');
            return;
        }

        // if (error) {
        //     setReportStatus('error');
        //     handleFullRender();
        //     return;
        // }

        // If loading is finished, check if we have data
        if (data) {
            handleFullRender();
        } else {
            // Small safety: if loading finished but no data (edge case), mark ready after a delay
            const timer = setTimeout(() => {
                if (!loading && !window.isPdfReady) {
                    console.log('[useReportReady] Safety trigger: marking ready despite missing data');
                    setPdfReady(true);
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [loading, data, autoReady, handleFullRender, setPdfReady]);

    return {
        handleFullRender,
        setPdfReady,
        reportStatus,
        statusMessage: STATUS_MESSAGES[reportStatus] || 'Processing...'
    };
};

export default useReportReady;

