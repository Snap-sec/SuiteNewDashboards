import { Card, CardContent } from '@/components/ui/card';

export function Starter({ image, title, subTitle, engage }) {
  return (
    <>
      <CardContent className="flex flex-col items-center gap-2.5 py-7.5">
        <div className="flex justify-center p-7.5 py-9">{image}</div>
        <div className="flex flex-col gap-5 lg:gap-7.5">
          <div className="flex flex-col gap-3 text-center">
            <h2 className="text-xl font-semibold text-mono">{title}</h2>
            <p className="text-sm text-foreground">{subTitle}</p>
          </div>
          <div className="flex gap-3 justify-center items-center mb-5">
            {engage}
          </div>
        </div>
      </CardContent>
    </>
  );
}
