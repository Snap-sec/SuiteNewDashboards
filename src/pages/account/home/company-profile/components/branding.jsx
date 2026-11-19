import { useEffect, useId, useState, useRef } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Image as ImageIcon, SquareMousePointer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input, InputWrapper } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FileUpload } from '@/components/custom/file-upload';
import { Skeleton } from '../../../../../components/ui/skeleton';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import appConfig from '@/config/appConfig';

function BrandingSkeleton() {
  return (
    <Card className="min-w-full">
      {/* Header */}
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-5 w-9 rounded-full" />
        </div>
      </CardHeader>

      <CardContent className="lg:py-7.5 py-5 space-y-7.5">
        {/* Company Logo section */}
        <div className="flex flex-wrap justify-between gap-5">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="flex items-center gap-5 max-w-30 w-full">
            <Skeleton className="h-[35px] rounded-md" />
          </div>

          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Brand Color section */}
        <div className="flex flex-wrap justify-between gap-5">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-52" />
          </div>

          <div className="flex items-center gap-2 sm:max-w-full xl:max-w-96 w-full">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Branding options */}
        <div className="flex flex-wrap justify-between gap-5">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-56" />
          </div>

          <div className="flex flex-col gap-5 max-w-96 w-full">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2.5">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Footer button */}
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

const Branding = ({
  brandingInfo = {},
  isLoading,
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  companyLogoUrl,
  setCompanyLogoUrl,
  handleSaveCompanyDetails,
  isSavingCompanyDetails,
  logo,
  website
}) => {
  const id = useId();
  const { user } = useAuth();
  const isMember = user?.role?.toLowerCase() === 'member';

  const isInitialized = useRef(false);
  const [imgSrc, setImgSrc] = useState('');

  const extractDomain = (url) => {
    if (!url) return '';
    try {
      let normalizedUrl = url.trim();
      if (!/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = 'http://' + normalizedUrl;
      }
      const parsed = new URL(normalizedUrl);
      return parsed.hostname.replace(/^www\./i, '');
    } catch (e) {
      let domain = url.trim().replace(/^https?:\/\//i, '');
      domain = domain.split('/')[0];
      return domain.replace(/^www\./i, '');
    }
  };

  const getFallbackLogo = () => {
    const domain = extractDomain(website);
    if (domain) {
      return appConfig.getLogoUrl(domain);
    }
    return toAbsoluteUrl('/media/brand-logos/question-mark.svg');
  };

  useEffect(() => {
    const currentLogo = companyLogoUrl || logo;
    if (currentLogo) {
      setImgSrc(currentLogo);
    } else {
      setImgSrc(getFallbackLogo());
    }
  }, [logo, companyLogoUrl, website]);

  const handleImageError = () => {
    const logoDevFallback = getFallbackLogo();
    const questionMarkPlaceholder = toAbsoluteUrl('/media/brand-logos/question-mark.svg');
    if (imgSrc === logoDevFallback) {
      setImgSrc(questionMarkPlaceholder);
    } else {
      setImgSrc(logoDevFallback);
    }
  };

  //   Prefill input feilds with existing data
  useEffect(() => {
    if (brandingInfo && !isInitialized.current) {
      setCompanyLogoUrl(logo || '');
      setPrimaryColor(brandingInfo?.primaryColor || '#BA35A0');
      setSecondaryColor(brandingInfo?.secondaryColor || '#BA35A0');
      isInitialized.current = true;
    }
  }, [brandingInfo, logo]);

  if (isLoading) return <BrandingSkeleton />;

  return (
    <>
      <style>
        {`
          .branding-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1200/bg-5.png')}');
          }
          .dark .branding-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1200/bg-5-dark.png')}');
          }
        `}
      </style>

      <Card className="min-w-full">
        <CardHeader className="gap-2">
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="lg:py-7.5 py-5">
          <div className="flex flex-wrap justify-between gap-5">
            <div className="flex flex-col">
              <div className="text-mono text-sm font-medium">Company Logo</div>
              <span className="text-secondary-foreground text-sm">
                Emblematic Corporate Identity Symbol
              </span>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-5 lg:gap-7.5 max-w-30 w-full">
              <img
                src={imgSrc}
                onError={handleImageError}
                className="h-[35px] mt-2"
                alt="image"
              />
            </div>

            <div className="w-full">
              <div className="space-y-2">
                <Label htmlFor="companyLogoUrl">Company Logo Url</Label>

                <Input
                  id="companyLogoUrl"
                  placeholder="https://example.com/logo.png"
                  value={companyLogoUrl}
                  onChange={(e) => setCompanyLogoUrl(e.target.value)}
                  disabled={isMember}
                />
              </div>
            </div>
          </div>
          <div className="border-t border-border my-7.5"></div>
          <div className="flex flex-wrap justify-between gap-5">
            <div className="flex flex-col">
              <div className="text-mono text-sm font-medium">Brand Color</div>
              <span className="text-secondary-foreground text-sm">
                Signature Palette Branding Element
              </span>
            </div>

            <InputWrapper className="sm:max-w-full xl:max-w-96 w-full">
              <p className="w-full">Primary Color</p>
              <div className="flex items-center justify-center size-10 shrink-0">
                <input
                  type="color"
                  className="size-5 rounded-full border-none cursor-pointer bg-transparent"
                  defaultValue={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  disabled={isMember}
                />
              </div>
              <Input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                disabled={isMember}
              />
            </InputWrapper>

            <InputWrapper className="sm:max-w-full xl:max-w-96 w-full">
              <p className="w-full">Secondary Color</p>
              <div className="flex items-center justify-center size-10 shrink-0">
                <input
                  type="color"
                  className="size-5 rounded-full border-none cursor-pointer bg-transparent"
                  defaultValue={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  disabled={isMember}
                />
              </div>
              <Input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                disabled={isMember}
              />
            </InputWrapper>
          </div>
          <div className="border-t border-border my-7.5"></div>
          <AuthorityGuard roles={['Admin']}>
            <div className="flex justify-end">
              <Button
                onClick={handleSaveCompanyDetails}
                disabled={isSavingCompanyDetails}
              >
                {isSavingCompanyDetails ? 'Saving' : 'Save'} Changes
              </Button>
            </div>
          </AuthorityGuard>
        </CardContent>
      </Card>
    </>
  );
};

export { Branding };
