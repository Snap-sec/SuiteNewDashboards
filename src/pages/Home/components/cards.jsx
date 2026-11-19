import { ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export function Card2({ logo, title, name, link, lock}) {
  const navigate = useNavigate();

  return (
    <Card 
      className={`h-full group ${!lock ? 'cursor-pointer hover:border-primary transition-colors' : ''}`}
      onClick={() => !lock && navigate(link)}
    >
      <CardContent className="flex flex-col justify-between p-2.5 gap-4">
        <div className="mb-2.5">
          <Card className="flex items-center justify-center relative bg-accent/50 w-full h-[180px]  mb-4  shadow-none">
            <img
              src={toAbsoluteUrl(`/media/logos/${logo}`)}
              className="h-[100px] w-full shrink-0 cursor-pointer"
              alt="image"
            />
          </Card>

          <div className="group-hover:text-primary transition-colors text-lg text-center cursor-pointer font-medium text-mono px-2.5 leading-5.5 block">
            {title}
          </div>
          <p className='mt-2 text-sm text-secondary-foreground group-hover:text-primary transition-colors text-center'>
            {name}
          </p>
        </div>


        {lock ? 
          <p className='text-center flex justify-center gap-2 items-center'>
            <Lock className='text-primary' size={15}/> <p className='text-[14px]'>Access Restricted</p>
          </p>
          :
          <div className="text-center">
              <span className='cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center has-data-[arrow=true]:justify-between whitespace-nowrap ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0 gap-1.5 text-[0.8125rem] leading-(--text-sm--line-height) [&_svg:not([class*=size-])]:size-4 h-auto p-0 bg-transparent rounded-none hover:bg-transparent data-[state=open]:bg-transparent font-medium text-primary hover:text-primary/90 [&_svg]:opacity-60 underline underline-offset-4 decoration-dashed decoration-1'>
                Go to {title}
              </span>
          </div>
        }

      </CardContent>
    </Card>
  );
}
