import React, { useState } from 'react';
import { Box, ExternalLink, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/custom/modal';

const getTechIconUrl = (techName) => {
  if (!techName) return null;
  const cleanName = techName
    .toLowerCase()
    .trim()
    .replace(/\.js$/, 'js')
    .replace(/\s+/g, '-');
  return `https://raw.githubusercontent.com/rdimascio/icons/master/icons/${cleanName}.svg`;
};

const TechnologyDetailsModal = ({ technology, open, setOpen }) => {
  const [imgError, setImgError] = useState(false);
  if (!technology) return null;

  const categories =
    technology?.categories ||
    technology?.properties?.technology_categories ||
    [];
  const website =
    technology?.website ||
    technology?.properties?.technology_website;
  const cpe =
    technology?.cpe ||
    technology?.properties?.technology_cpe;
  const description =
    technology?.description ||
    technology?.properties?.technology_description;
  const techName = technology?.value || '-';
  const iconUrl = getTechIconUrl(techName);

  return (
    <Modal
      title="Technology Details"
      open={open}
      setOpen={setOpen}
      className="sm:max-w-xl"
    >
      <div className="flex flex-col gap-5">
        {/* Header with icon, name, and website */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-secondary text-primary shrink-0 flex items-center justify-center size-12">
              {!imgError && iconUrl ? (
                <img
                  src={iconUrl}
                  alt={techName}
                  className="size-7 object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Box className="h-6 w-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight">
                  {techName}
                </h2>
                {technology?.isNew && (
                  <Badge size="sm" variant="primary">
                    New
                  </Badge>
                )}
              </div>
              {cpe && (
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  {cpe}
                </p>
              )}
            </div>
          </div>

          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary hover:underline shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="h-3.5 w-3.5" />
              Website
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Categories
            </p>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((category, index) => (
                <Badge key={index} variant="secondary" appearance="outline">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {description && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Description
            </p>
            <p className="text-sm text-foreground/90 leading-relaxed bg-muted/40 p-3 rounded-md border border-border/60">
              {description}
            </p>
          </div>
        )}

        {/* Metadata grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg border border-border/50 text-xs">
          <div>
            <span className="text-muted-foreground block mb-0.5">Scope</span>
            <Badge variant="secondary" appearance="outline" className="capitalize text-xs">
              {technology.network_scope || 'external'}
            </Badge>
          </div>
          <div>
            <span className="text-muted-foreground block mb-0.5">Asset / Domain</span>
            <span className="font-mono text-xs font-medium text-foreground truncate block" title={technology.assetValue || technology.domain}>
              {technology.assetValue || technology.domain || '-'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block mb-0.5">Signals / Exposures</span>
            <span className="font-semibold text-xs text-foreground">
              {technology.total_signals ?? technology.total_exposures ?? technology.signals?.total ?? 0}
            </span>
          </div>
        </div>

        {/* Assets list */}
        {assets.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">
                Associated Assets
              </p>
              <span className="text-xs text-muted-foreground">
                Showing {assets.length}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 max-h-[260px] overflow-y-auto pr-1">
              {assets.map((asset, index) => {
                const assetValue =
                  typeof asset === 'string'
                    ? asset
                    : asset?.value ||
                    asset?.domain ||
                    asset?.subdomain ||
                    asset?.name ||
                    asset?.ip ||
                    asset?.host ||
                    asset?.asset_value ||
                    '-';
                const assetId = asset?._id;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2.5 bg-secondary/40 hover:bg-secondary/70 transition-colors rounded-md text-sm border border-border/40"
                  >
                    <span className="font-mono text-xs truncate max-w-[380px]">
                      {assetValue}
                    </span>
                    {assetId && (
                      <Link
                        to={`/casm/asset-details/${assetId}`}
                        className="text-xs text-primary hover:underline flex items-center gap-1 shrink-0 ml-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-muted-foreground bg-muted/30 rounded-md">
            No associated assets found for this technology.
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TechnologyDetailsModal;
