import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AccountSettingsSkeleton() {
  const isMobile = useIsMobile();

  return (
    <div className="flex grow gap-5 lg:gap-7.5 pointer-events-none">
      {/* ================= SIDEBAR ================= */}
      {!isMobile && (
        <div className="w-[230px] shrink-0">
          <div className="w-[230px] space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex flex-col items-stretch grow gap-5 lg:gap-7.5 pb-4">
        {/* ===== BASIC SETTINGS ===== */}
        <Card className="pb-2.5">
          <CardHeader>
            <CardTitle>Basic Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-4 w-56" />
              <div className="flex justify-between items-center grow">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="size-12 rounded-full" />
              </div>
            </div>

            {[1, 2].map((i) => (
              <div key={i} className="flex items-baseline gap-2.5">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-10 flex-1" />
              </div>
            ))}

            <div className="flex justify-end pt-2.5">
              <Skeleton className="h-10 w-36" />
            </div>
          </CardContent>
        </Card>

        {/* ===== PASSWORD ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-baseline gap-2.5">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-10 flex-1" />
              </div>
            ))}
            <div className="flex justify-end pt-2.5">
              <Skeleton className="h-10 w-44" />
            </div>
          </CardContent>
        </Card>

        {/* ===== TWO FACTOR ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Two-Factor authentication(2FA)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 mb-7">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border rounded-xl px-3.5 py-2.5"
                >
                  <div className="flex items-center gap-3.5">
                    <Skeleton className="size-[50px]" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-56" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-10 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ===== PREFERENCES ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-baseline gap-2.5">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-10 flex-1" />
              </div>
            ))}
            <div className="flex justify-end">
              <Skeleton className="h-10 w-36" />
            </div>
          </CardContent>
        </Card>

        {/* ===== APPEARANCE ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-64 mb-5" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton className="h-[170px] rounded-xl mb-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ===== NOTIFICATIONS ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-5 mb-7">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border rounded-xl px-3.5 py-2.5 grow"
                >
                  <div className="flex items-center gap-3.5">
                    <Skeleton className="size-[50px]" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-10 rounded-full" />
                </div>
              ))}
            </div>

            <div className="flex gap-20">
              {[1, 2].map((col) => (
                <div key={col} className="flex flex-col gap-4 w-full">
                  <Skeleton className="h-4 w-40" />
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-4 w-32" />
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ===== DELETE ACCOUNT ===== */}
        <Card>
          <CardHeader>
            <CardTitle>Delete Account</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-5 w-56" />
            <div className="flex justify-end gap-2.5">
              <Skeleton className="h-10 w-44" />
              <Skeleton className="h-10 w-44" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
