import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Link } from 'react-router';
import { MoveRight } from 'lucide-react';

function ProductCard({ logo, title, description, link }) {
  return (
    <div
      className="
        rounded-2xl bg-accent/60 hover:bg-accent overflow-hidden shadow-md p-3
        flex items-center justify-between cursor-pointer
        transition-all duration-300 ease-out
        hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]
      "
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
            <img
              src={toAbsoluteUrl(`/media/logos/${logo}`)}
              className="h-6 shrink-0"
              alt="image"
            />
          </div>
          <div>
            <h2 className="font-semibold">{title}</h2>
            <p className="text-sm text-secondary-foreground">{description}</p>
          </div>
        </div>
      </div>

      <Link to={`${link}`}>
        <Button variant="primary" appearance="ghost">
          Visit <MoveRight />
        </Button>
      </Link>
    </div>
  );
}

export default ProductCard;
